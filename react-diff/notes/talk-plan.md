Outline
=======
 - Intro
 - Show demo app - Meetups viewer
 - What needs to happen when setState() or setProps() is called
 - Dirty component queue and update transaction
 - Transaction flushing and component sorting
 - Conclusion

## Intro

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


