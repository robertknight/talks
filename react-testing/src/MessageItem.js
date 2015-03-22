import classNames from 'classnames';
import React from 'react';

export default class MessageItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <div className={classNames({
			'message-item': true,
			'message-item-selected': this.props.isSelected
		})}
			ref="container"
			onClick={this.props.onClick}
		>
			<div className='message-item-subject' ref="subject">{this.props.subject}</div>
			<div className='message-item-from' ref="from">{this.props.from}</div>
			<div className='message-item-snippet' ref="snippet">{this.props.snippet}...</div>
		</div>;
	}
}
