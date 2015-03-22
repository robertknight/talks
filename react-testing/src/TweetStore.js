import {Store} from 'flummox';

const TWITTER_PROXY_URL = 'http://localhost:3000/timeline';

export default class TweetStore extends Store {
	constructor(flux) {
		super();

		this.state = {
			tweets: []
		};
		this.fetchTweets();
	}

	getTweets() {
		return this.state.tweets;
	}

	fetchTweets() {
		fetch(TWITTER_PROXY_URL).then(res => {
			return res.json();
		}).then(json => {
			let tweets = json.map(entry => {
				return {
					id: entry.id,
					user: {
						screenName: entry.user.screen_name,
						description: entry.user.name,
						icon: entry.user.profile_image_url_https
					},
					text: entry.text,
					createdAt: entry.created_at
				}
			});
			this.setState({tweets: tweets});
		}).catch(err => {
			console.error('fetching tweets failed');
		});
	}
}

