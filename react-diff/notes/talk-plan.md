Outline
=======
 - Intro
 - Show demo app - Meetups viewer
 - What needs to happen when setState() or setProps() is called
 - Possible approaches to updating view
  - Full document replacement
  - Diff-ing tree to produce an edit script
  - Complexity of generic tree diff
  - React's approach: Heuristics to implement O(N) diffing
 - React update walkthrough
  - Dirty component queue and update transaction
  - Transaction flushing and component sorting
  - Level-by-level reconciliation
  - List reconciliation
    - How generic list diff-ing works - O(n^2) cost
    - How React optimizes with item keys - O(n) cost
 - Conclusion

## Intro

## Walkthrough

### Demo app - Meetup Viewer
 - To illustrate the React update flow, we'll use a simple demo app.
   This app is a Meetup viewer, for viewing info about a meetup
   and what is happening at future events.
 - The UI has three parts:
   - The top section has a banner for the meetup and a tab
     bar that lets the user switch between details of the current
     meetup and a list of past meetups
   - A tab that shows details of the upcoming meetup
   - A tab that shows a list of past meetups
 - Our app is structured as a set of React components [_show
   in Chrome dev tools_]:
   - A top-level component for the app
   - One for the logo
   - A tab bar component
   - The meetup info tab
   - The meetup list tab
 - We'll walk through what goes on in React when we navigate
   around the app.

### Reconciliation overview
 - The main navigation action the user can take is to
   switch tabs. When the app loads, the first tab is
   selected, the render() method on our app is called and
   React produces this markup [_show markup_]
 - When the use navigates to the second tab, the state of
   our app is updated, render() is called again and React
   produces this markup [_show markup_]
 - React's task here is to get the document from the first
   markup to the second as efficiently as possible.
 - There are several ways we could do this:
   1. Replace the whole UI. This works, it gives the correct
      result, but is slow.
   2. Instead, we'd like a set of instructions, or 'edit script'
      that will tells us how to convert this DOM [_show DOM A_]
      into this DOM [_show DOM B_] with as few steps as possible.
   3. This is like a 'git diff' [_show git diff_] but applied
      to a tree.

   [_show tree diff graphic_]

   1. __Problem__ - There are lots of ways to modify a tree,
      comparing two trees to find the minimal set of
      changes is expensive. [_show complexity graphic_]
   2. __Solution__ - Consider the kinds of changes which are likely
      to happen between one DOM tree and the next, pick some
      heuristics which speed up the comparison at the risk
      of making more changes to the DOM than necessary.

#### First Optimization - Level-by-level
  - The first major heuristic is that it is rare for one part
    of the tree to move to a completely different part.
    Instead what usually happens is that a UI component is
    added or removed under a parent.
  - We can take advantage of this by going down the tree
    level-by-level and only looking to find the minimal set of
    edits to the DOM within a level. If a component moves to
    a completely different part of the tree, React
    will re-create it from scratch.
  - This reduces the cost to O(_depth-of-tree_ _x_ _cost-of-each-level_)


#### Second Optimization - Item Keys
  - So now we've simplified the problem by dealing with one
    level of the DOM at each step. What is the cost of diff-ing
    the children at each level?
  - A general-purpose approach is to find the _longest common
    subsequence_ of two lists. That means, the list of
    common items which occur in the same order in both.

    The cost of this is O(n^2), which could still be expensive
    if we have a lot of items.
  - React's optimization here is that in most web applications,
    we can usually come up with a unique identifier for every
    item in the list. The ID of a tweet, the number of a bug,
    the date of a meetup etc.
  - If every item in the list has a unique ID, we can compare two
    lists much more cheaply:

    ````
    for (var item in newList) {
      if (item in oldList) {
        // item unchanged or moved
      } else {
        // item added
      }
    }
    for (var item in oldList) {
      if (!(item in newList)) {
        // item removed
      }
    }
    ````

#### Third Optimization - Component Types

So we now have a combination of two optimizations that reduce
the complexity down to O(n), so at worst the cost depends on
the total number of nodes in the DOM. However, we still want
to do better!

The next piece of domain-specific knowledge we can use is that
we have a tree of components. If one type of component
is replaced with another, the new and old probably don't have
much in common.

For example, when we switch tabs in the meetups app, the
content changes completely. Since we're using a different
component, React won't bother to recurse into the trees
that make up the components.

#### Fourth Optimization - Comparing DOM properties and styles

After going down the tree level by level and matching up
items from the previous and next render, we'll come to a
point where we have a React.DOM.* component from the
previous render, a React.DOM.* component from the next render
and we need to update the real DOM.

Rather than comparing each property from the DOM component
to the matching property in the real DOM object, we instead
compare the DOM property from the previous props with
the property from the next props. Doing the comparison between
Javascript values is much cheaper than accessing the DOM
to retrieve the current property value.

#### Fifth Optimization - shouldComponentUpdate()

The previous three optimizations are general purpose optimizations
for app user interfaces. For our specific apps, we might
have knowledge that certain component changes won't
affect the way a component is displayed or the events it
handles. React therefore provides a shouldComponentUpdate()
method which a component will implement to tell React whether
a change in props or state will require a re-render..

## Additional Optimizations

In addition to the reconciliation algorithm optimizations,
React also implements additional optimizations to reduce
the number of UI updates.

### Batching

The first is to batch changes. If you call setState() or setProps()
on one component, that may trigger a series of updates to other
components. The purpose of batching is to collect all of those
updates together and perform a re-render only once.

The algorithm is implemented in ReactUpdates.js and works as follows:
 - The user performs an action, and setState() or setProps()
   gets called. The first call starts a _batched update_.
 - During a batched update, any modified components are added
   to a list.
 - When the batched update ends, all of the dirty components
   are sorted by depth from the root component so that components
   higher up the DOM tree are processed first. The rationale
   is that
 - Exactly which updates get collected together in a single batch
   depends on a pluggable batching strategy. React provides two
   out of the box:
   - The default strategy is to collect all of the updates that
     happen during the first setState() / setProps() call
     and perform the update when the top-level setState() / setProps()
     call returns.
   - Another strategy requests an animation frame and collects
     all of the updates which happen from the first update
     until the animation frame occurs.


### Event Listeners

The last major optimization is how adding handlers via on_EventName_()
works. Instead of attaching an event listener to the DOM
element corresponding to the React component, React instead
adds one event listener at the root of the document.

## Conclusion:

 - Re-rendering the entire UI whenever anything changes is what
   used to happen in the pre-AJAX web. It was slow, but it was reliable.
 - React provides the simplicity of that but with better performance by
   using a virtual DOM and diff-ing to determine what changed between
   the current and next versions of a component.
 - A general purpose diff of two trees to find the edit script to change
   one into another would be too slow. React's design considers the kinds
   of change that are common and picks a set of heuristics to speed up
   the diff-ing process at the risk of doing more DOM changes than necessary
   in uncommon cases.
 - In addition to the virtual DOM and diff-ing, React also optimizes UI updates
   by using event delegation to avoid adding/removing event listeners, batching
   to coalesce DOM updates and provides hooks for the programmer to take advantage
   of domain-specific knowledge to optimize updates further.

   These techniques are not new, but you get them for free in React, as opposed to
   having to implement them yourself.

## Additional Notes

Illustrate basic task:

 - Call App.render() -> Component tree A1 -> DOM tree D1
 - Call App.setState(new state)
 - Call App.render() -> Component tree A2

 Given trees A1 and A2, what changes do we need to make
 to DOM tree D1 to get DOM tree D2?

 - Simplest possible approach: Get rid of the whole DOM
   tree and regenerate it again

   Whatever optimizations React provides, has to produce the
   same output as if we did this.

   Problem: This would be slow, especially for a large and complex UI

   What we'd like to do instead is find the minimum set of steps
   needed to turn D1 into D2.

   What kind of steps could we have in this list?

   - Change property P of element X from V1 to V2
   - Insert element X as the Nth child of element Y
   - Remove element X
   - Move element X from the Nth child to the Mth child of element Y

How does a diff algorithm usually work:


What kind of performance does this have:
 - For diff-ing two flat lists: O(n^2)
 - Diff-ing trees: O((n log n) ^ 2)
 - eg. Consider a Twitter app - we have 100 tweets
   and we render a new version with 101 tweets.
   Cost of diff would be 10,000 operations.

How can we make things cheaper?

Basic idea is: Consider the kinds of changes which typically
 happen when our UI updates optimize for those.

 React's diff algorithm runs faster than the generic tree-diffing approaches
 but may make more changes than required to the DOM if we had a truly minimal
 diff, if these less common updates occur.

===

 1. HTML elements rarely move from one part of the DOM
    to a completely different part.

	Instead it is much more common that we add or remove
	part of the tree.

	Optimization #1 -
	 Go down the tree level-by-level and look for changes
	 within each level. Don't bother looking for changes where
	 one part of the tree moved to a different part.

 2. When we have lists of items (TODOs, tweets, bugs), we
    can usually come up with a unique ID for each item.

	eg. In a list of tweets, emails, bugs, shopping cart
	    items, recipe ingredients - we could easily come
		up with a unique ID for each.

		Coming with an edit script from a list L1 to L2
		is much easier and cheaper if every element in
		a list is unique.

		For every item in the list, there are only
		four possibilities:

		1) The item remains in the same place
		2) The item moved
		3) The item was added
		4) The item was deleted

	Optimization #2 -
	 Require each item in a list to have a unique key.

	 Given two lists of children which have unique keys,
	 we can calculate a diff in linear time.

	 Tweet3 - Tweet4
	 Tweet2 - Tweet3
	 Tweet1 - Tweet2
	          Tweet1

	 for (child in newChildren) {
	 	var oldChild = findChildWithKey(oldChildren, child.key);
		if (!oldChild) {
			// new element
		} else if (oldChild.index != child.index) {
			// moved element
		} else {
			// nothing changed
		}
	 }

	 for (oldChild in oldChildren) {
	 	var newChild = findChildWithKey(newChildren, child.key);
		if (!newChild) {
			// element was removed
		}
	 }

 3. If one type of component is replaced with another, there
    probably isn't that much similarity between the DOM trees
	for the items.

	Optimization #3 -
	 If the type of a node changed, don't bother diff-ing the sub-trees

Other Optimizations:

 Event Delegation:

  Attaching and removing event listeners on individual elements is slow.
  Instead React adds one event listener to the root of the document and gives
  each DOM element a unique ID that includes the path.

  It maintains a map from (ID => listener) for all the virtual DOM elements
  that have registered a listener.

  eg.
   When the event listener on the document receives the event, it uses
   event.target to find out which node received the event and gets its ID.
   It can lookup the event listeners for this ID in the map. It can also
   look up event listeners on all parent elements using some simple string
   manipulation.

   eg. User clicks a button with ID 'a.b.c.d' (where 'd' represents the button
   and 'a.b.c' represents the parent elements).

     clickEventListeners['a.b.c.d'](event)
     clickEventListeners['a.b.c'](event)
     clickEventListeners['a.b'](event)
     clickEventListeners['a'](event)

 Batching:
  A common scenario is that one action results in a series of changes
  to the state / properties of components.

  1. User performs an action that results in setState() or setProps()
     being called on a component.

  2. React starts a new update transaction and calls render() on the root
     component that changed.


 shouldComponentUpdate():
  You may have specific knowledge in your app about whether
  a state or props change will require an update.

  You can use this by providing a shouldComponentUpdate()
  implementation.
