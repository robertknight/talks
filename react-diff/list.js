var ListItem = React.createClass({
	displayName: 'ListItem',

	render: function() {
		var self = this;
		return React.DOM.div({
			className:'list-item',
		},
		React.DOM.input({
			type:'button',
			value: 'Remove '+ self.props.label,
			onClick: function() {
				self.props.onRemove();
			}
		})
		);
	}
});

var ListView = React.createClass({
	displayName: 'ListView',

	render: function() {
		var items = [];
		var self = this;
		self.props.items.forEach(function (item) {
			items.push(ListItem({
				// Comment out line below to show effect of using item keys
				//key: item,
				label: item,
				onRemove: function() {
					self.props.onRemove(item);
				}
			}, item));
		});
		return React.DOM.div({className:'list'},
			items
		);
	}
});

var App = React.createClass({
	displayName: 'App',

	getInitialState: function() {
		return {
			items: [],
			maxId: 1
		}
	},

	render: function() {
		var self = this;
		return React.DOM.div({},
			ListView({
				items: this.state.items,
				onRemove: function(itemToRemove) {
					measureDOMChanges(function() {
						self.setState({
							items: self.state.items.filter(function (item) {
								return item != itemToRemove
							})
						});
					});
				}
			}),
			React.DOM.input({
				type:'button',
				onClick: function() {
					measureDOMChanges(function() {
						self.setState({
							items: self.state.items.concat(['item #' + self.state.maxId]),
							maxId: self.state.maxId + 1
						});
					});
				},
				value:'Add Item'
			})
		);
	}
});

React.renderComponent(App({}), document.getElementById('app'));
