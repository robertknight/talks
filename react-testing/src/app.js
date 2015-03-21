import React from 'react';

import MessageList from './MessageList';
import MessageView from './MessageView';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			messages: [{
				id: 'message-1',
				subject: 'Meeting next Monday',
				from: 'John Doe',
				content: 'Note about a meeting next monday',
				snippet: 'Note about a meeting next monday'
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
