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
			<div ref="subject">{this.props.subject}</div>
			<div ref="from">{this.props.from}</div>
			<div ref="snippet">{this.props.snippet}</div>
		</div>;
	}
}
