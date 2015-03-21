import React from 'react';

export default class MessageView extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <div>
			<div ref="content">{this.props.content}</div>
		</div>;
	}
}
