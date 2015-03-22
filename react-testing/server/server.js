import cors from 'cors';
import express from 'express';
import fs from 'fs';

import Twitter from 'twit';

var config = JSON.parse(fs.readFileSync('server-config.js'));
var client = new Twitter(config);

let cachedTweets;
let app = express();
app.use(cors());
app.get('/timeline', (req, res) => {
	if (cachedTweets) {
		res.send(cachedTweets);
		res.end();
	} else {
		var params = {};
		client.get('statuses/home_timeline', params, (error, tweets, response) => {
			if (error) {
				res.status(500);
				res.send(`fetching timeline failed: ${error.toString()}`);
			} else {
				cachedTweets = tweets;
				res.send(tweets);
				res.end();
			}
			res.end();
		});
	}
});

let server = app.listen(3000, () => {
	console.log('Twitter proxy listening');
});

