import React from 'react';

import MessageList from './MessageList';
import MessageView from './MessageView';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			messages: [{
				id: 'message-1',
				subject: 'Meeting next Tuesday',
				from: 'John Doe',
				content: 'Note about a meeting next monday',
				snippet: 'Note about a meeting next monday'
			},{
				id: 'message-2',
				subject: 'Meeting about something else',
				from: 'Jane Doe',
				content: 'Another note about a meeting',
				snippet: 'Foo bar baz'
			}],

			selectedMessage: null
		};
	}

	render() {
		return <div className="app">
			<MessageList messages={this.state.messages} onSelect={message =>
				this.setState({selectedMessage: message})
			}/>
			<MessageView message={this.state.selectedMessage}/>
		</div>
	}
}

var content = document.getElementById('app');
React.render(<App />, content);
