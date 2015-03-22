import React from 'react/addons';
import rewire from 'rewire';
import {expect} from 'chai';

import * as utils from './utils';

var MessageList = rewire('../src/MessageList');

const TEST_MESSAGES = [{
	id: 'message-1',
	subject: 'Test Subject',
	from: 'Test Sender',
	snippet: 'Test Snippet'
},{
	id: 'message-2',
	subjct: 'Meeting on Tuesday',
	from: 'Jane Doe',
	snippet: 'Another snippet'
}];

class StubMessageItem extends React.Component {
	render() {
		return <div>stub message</div>;
	}
}

MessageList.__set__('MessageItem', StubMessageItem);

describe('MessageList', () => {
	it('should display messages', () => {
		utils.withContainer(element => {
			let list = React.render(
				<MessageList messages={TEST_MESSAGES}/>
			, element);
			let items = React.addons.TestUtils.scryRenderedComponentsWithType(list, StubMessageItem);

			// check that the correct number of messages
			// were rendered
			expect(items.length).to.equal(TEST_MESSAGES.length);

			// check that message items were rendered with the correct
			// props
			expect(items[0].props.subject).to.equal(TEST_MESSAGES[0].subject);
			expect(items[0].props.from).to.equal(TEST_MESSAGES[0].from);
			expect(items[0].props.snippet).to.equal(TEST_MESSAGES[0].snippet);
		});
	});
});
