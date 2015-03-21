import React from 'react';

import MessageItem from './MessageItem';

export default class MessageList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedMessage: null
		};
	}

	render() {
		return <div className="message-list">
		{this.props.messages.map(message =>
			<MessageItem 
				key={message.id}
				subject={message.subject}
				from={message.from}
				snippet={message.snippet}
				isSelected={message === this.state.selectedMessage}
				
				onClick={() => this.props.onSelect(message)}
			/>
		)}
		</div>
	}
}
