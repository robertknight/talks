import React from 'react';

import TweetList from './TweetList';
import TweetStore from './TweetStore';

export default class TweetListContainer extends React.Component {
	constructor(props) {
		super(props);

		var tweetStore = new TweetStore();

		this.state = {
			tweets: tweetStore.getTweets()
		}
	}

	render() {
		return <TweetList tweets={this.state.tweets} onSelect={tweet =>
			this.setState({selectedTweet: tweet})
		}/>
	}
}

