import React from 'react';

import TweetListContainer from './TweetListContainer';
import TweetView from './TweetView';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedTweet: null
		};
	}

	render() {
		return <div className="app">
			<TweetListContainer tweets={this.state.tweets} onSelect={tweet =>
				this.setState({selectedTweet: tweet})
			}/>
			<TweetView tweet={this.state.selectedTweet}/>
		</div>
	}
}

var content = document.getElementById('app');
React.render(<App />, content);
