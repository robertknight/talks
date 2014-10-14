var MeetupItem = React.createClass({
	displayName: 'MeetupItem',

	render: function() {
		return React.DOM.div({className: 'meetupItem'},
			React.DOM.div({className:'title'}, this.props.meetup.name),
			React.DOM.div({className:'details'}, this.props.meetup.details)
		);
	}
});

var MeetupList = React.createClass({
	displayName: 'MeetupList',

	render: function() {
		return React.DOM.div({className: 'meetupList'},
			this.props.meetups.map(function (meetup, index) {
				return MeetupItem({meetup: meetup, key: index});
			})
		);
	}
});

var MeetupDetails = React.createClass({
	displayName: 'MeetupDetails',

	render: function() {
		return React.DOM.div({className: 'meetupDetails'},
			React.DOM.div({className: 'title'}, this.props.meetup.name),
			React.DOM.div({className: 'details'}, this.props.meetup.details),
			React.DOM.div({className: 'attending'}, this.props.meetup.attending + ' reactors')
		);
	}
});

var tabOrder = 0;

var Tab = React.createClass({
	displayName: 'Tab',

	render: function() {
		return React.DOM.div(Object.assign({}, this.props), this.props.children);
	}
});

var TabBar = React.createClass({
	displayName: 'TabBar',

	getInitialState: function() {
		return {
			selectedIndex: 0
		};
	},

	render: function() {
		++tabOrder;

		var self = this;

		// uncomment lines below to change component type
		// on every other render
		var tabClass = React.DOM.div;
		if (tabOrder % 2 == 0) {
			//tabClass = Tab;
		}

		var tabs = [];
		this.props.tabs.forEach(function (tab, index) {
			var selectedClass;
			if (self.state.selectedIndex == index) {
				selectedClass = 'selected';
			}
			tabs.push(tabClass({
				className:'tab ' + selectedClass,
				onClick: function() {
					self.setState({selectedIndex: index});
					self.props.onTabChanged(tab.id);
				},
				key: tab.id
			}, tab.label));
		});

		return React.DOM.div({className: 'tabBar'}, tabs);
	}
});

var CURRENT_MEETUP_TAB = 1;
var PAST_MEETUP_TAB = 2;

var BLURB = 'Join us for an evening of interesting discussions, lively debate and sharing ideas related to Facebook React.Beers and pizza from 18:30, the presentations will start at 7';

var MeetupApp = React.createClass({
	displayName: 'MeetupApp',

	getInitialState: function() {
		return {
			meetups: [{
				name: 'React October Meetup',
				details: BLURB,
				attending: 100
			},{
				name: 'React September Meetup',
				details: BLURB,
				attending: 95
			},{
				name: 'React August Meetup',
				details: BLURB,
				attending: 80
			},{
				name: 'React July Meetup',
				details: BLURB,
				attending: 75
			}],
			tab: CURRENT_MEETUP_TAB
		};
	},

	render: function() {
		var activeTab;
		if (this.state.tab == CURRENT_MEETUP_TAB) {
			activeTab = MeetupDetails({
				meetup: this.state.meetups[0]
			});
		} else if (this.state.tab == PAST_MEETUP_TAB) {
			activeTab = MeetupList({
				meetups: this.state.meetups
			});
		}

		var self = this;
		return React.DOM.div({className: 'meetupApp'},
			React.DOM.div({className: 'header'},
				React.DOM.img({
					className: 'logo',
					src:'http://photos2.meetupstatic.com/photos/event/5/d/d/6/global_369204022.jpeg'
				}),
				React.DOM.span({className: 'title'}, 'London React User Group')
			),
			TabBar({
				tabs: [{
					label: 'Current Meetup',
					id: CURRENT_MEETUP_TAB
				},{
					label: 'Past Meetups',
					id: PAST_MEETUP_TAB
				}],
				onTabChanged: function(id) {
					self.setState({tab: id});
				}
			}),
			activeTab
		);
	}
});

React.renderComponent(MeetupApp({}), document.getElementById('app'));

var domUpdateObserver = new MutationObserver(function(records) {
	var added = 0;
	var removed = 0;
	var updatedAttrs = 0;
	var updatedText = 0;
	records.forEach(function(record) {
		if (record.type == 'childList') {
			added += record.addedNodes.length;
			removed += record.removedNodes.length;
		} else if (record.type == 'attributes') {
			updatedAttrs += 1;
		} else if (record.type == 'characterData') {
			updateText += 1;
		}
	});

	console.log('DOM Update: Added %d nodes, removed %d nodes, updated %d nodes',
	  added, removed, updatedAttrs + updatedText);
});

domUpdateObserver.observe(document.getElementById('app'), {
	childList: true,
	subtree: true,
	attributes: true,
	characterData: true
});
