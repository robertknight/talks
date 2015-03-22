import React from 'react/addons';

import {expect} from 'chai';
import rewire from 'rewire';

import setup from './setup';

var TweetItem = rewire('../src/TweetItem');

const TEST_TWEET = {
	id: 'tweet-1',
	user: {
		screenName: 'robknight_',
		description: 'Robert Knight'
	},
	text: 'Hello tweet',
	createdAt: new Date(Date.now() - 180.0 * 1000)
};

describe('TweetItem', () => {
	it('should display item details', () => {
		var tweet = TEST_TWEET;
		var item = React.addons.TestUtils.renderIntoDocument(
			<TweetItem tweet={tweet}/>
		);

		var userIcon = React.findDOMNode(item.refs.userIcon);
		var userDescription = React.findDOMNode(item.refs.userDescription);
		var userScreenName = React.findDOMNode(item.refs.userScreenName);
		var date = React.findDOMNode(item.refs.date);
		var text = React.findDOMNode(item.refs.text);

		expect(userDescription.textContent).to.equal(tweet.user.description);
		expect(userScreenName.textContent).to.equal('@' + tweet.user.screenName);
		expect(date.textContent).to.include('3m');
		expect(text.textContent).to.equal(tweet.text);
	});
});
