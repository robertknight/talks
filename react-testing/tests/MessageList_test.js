import React from 'react/addons';
import rewire from 'rewire';
import {expect} from 'chai';

import * as utils from './utils';

var MessageList = rewire('../src/MessageList');

import MessageItem from '../src/MessageItem';

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

describe('MessageList', () => {
	beforeEach(() => {
		MessageList = rewire('../src/MessageList');
	});

	it('should display messages (DOM class matching)', () => {
		let list = React.addons.TestUtils.renderIntoDocument(<MessageList messages={TEST_MESSAGES}/>);
		let items = React.findDOMNode(list).querySelectorAll('.message-item');
		expect(items.length).to.equal(TEST_MESSAGES.length);
	});

	it('should display messages (component type matching)', () => {
		let list = React.addons.TestUtils.renderIntoDocument(<MessageList messages={TEST_MESSAGES}/>);
		let items = React.addons.TestUtils.scryRenderedComponentsWithType(list, MessageItem);
		expect(items.length).to.equal(TEST_MESSAGES.length);
	});

	it('should display messages (stub component type matching)', () => {
		MessageList.__set__('MessageItem', StubMessageItem);

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

	it('should display messages (shallow rendering)', () => {
		let shallowRenderer = React.addons.TestUtils.createRenderer();
		let renderList = () => {
			shallowRenderer.render(<MessageList messages={TEST_MESSAGES}/>);
			let list = shallowRenderer.getRenderOutput();
			return list.props.children.filter(component => component.type == MessageItem);
		}
		let items = renderList();

		expect(items.length).to.equal(TEST_MESSAGES.length);
	});

	it('should select message on click (stub component)', () => {
		MessageList.__set__('MessageItem', StubMessageItem);

		let selectedMessage = null;
		utils.withContainer(element => {
			let list = React.render(<MessageList messages={TEST_MESSAGES}/>, element);
			let items = React.addons.TestUtils.scryRenderedComponentsWithType(list, StubMessageItem);
			expect(items[0].props.isSelected).to.equal(false);

			items[0].props.onClick();
			expect(items[0].props.isSelected).to.equal(true);
		});
	});

	it('should select message on click (shallow rendering)', () => {
		let shallowRenderer = React.addons.TestUtils.createRenderer();
		let renderList = () => {
			shallowRenderer.render(<MessageList messages={TEST_MESSAGES}/>);
			let list = shallowRenderer.getRenderOutput();
			return list.props.children.filter(component => component.type == MessageItem);
		}
		let items = renderList();

		expect(items.length).to.equal(TEST_MESSAGES.length);
		expect(items[0].props.isSelected).to.equal(false);
		items[0].props.onClick();

		items = renderList();
		expect(items[0].props.isSelected).to.equal(true);
	});
});

