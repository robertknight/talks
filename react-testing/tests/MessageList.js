import rewire from 'rewire';

import setup from './setup';

var React;
var MessageList;
var appElement;

describe('MessageList', () => {
	before(() => {
		return setup().then(() => {
			React = require('react');
			MessageList = rewire('../src/MessageList');

			MessageList.__set__('MessageItem', class StubMessageItem extends React.Component {
				render() {
					return <div>Fake message</div>
				}
			});
		});
	});

	beforeEach(() => {
		appElement = document.getElementById('app');
		appElement.innerHTML = '';
	});

	it('should display messages', () => {
		var list = React.render(
			<MessageList messages={[{
				id: 'message-1',
				subject: 'Test Subject',
				from: 'Test Sender',
				snippet: 'Test Snippet'
			}]}/>
		, appElement);
	});
});
