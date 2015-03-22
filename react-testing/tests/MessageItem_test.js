import React from 'react/addons';

import {expect} from 'chai';
import rewire from 'rewire';

import setup from './setup';

var MessageItem = rewire('../src/MessageItem');

describe('MessageItem', () => {
	it('should display item details', () => {
		var item = React.addons.TestUtils.renderIntoDocument(
			<MessageItem subject="test-subject"
			             from="test-sender"
						 snippet="test-snippet"
			/>
		);
		var subject = React.findDOMNode(item.refs.subject);
		var from = React.findDOMNode(item.refs.from);
		var snippet = React.findDOMNode(item.refs.snippet);

		expect(subject.textContent).to.equal('test-subject');
		expect(from.textContent).to.equal('test-sender');
		expect(snippet.textContent).to.equal('test-snippet');
	});
});
