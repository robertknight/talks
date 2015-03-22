const DUMMY_USERS = [{
	screenName: 'robknight_',
	description: 'Robert Knight',
	icon: 'https://pbs.twimg.com/profile_images/3405732468/034b3b72f72d31050cdb6d52a73e2e1a_bigger.jpeg'
},{
	screenName: 'reactjs',
	description: 'React News'
}];

const DUMMY_TWEETS = [{
	id: 'message-1',
	user: DUMMY_USERS[0],
	text: 'Hello tweet',
	createdAt: 'Mon Nov 29 21:18:15 +0000 2015'
},{
	id: 'message-2',
	user: DUMMY_USERS[1],
	text: 'Another test tweet',
	createdAt: 'Mon Nov 29 21:18:15 +0000 2010'
}];

export default class TweetStore {
	constructor() {
		this.tweets = DUMMY_TWEETS;
	}

	getTweets() {
		return this.tweets;
	}
}

