var RewirePlugin = require('rewire-webpack');

module.exports = {
	entry: {
		//app: './src/app',
		tests: './tests/MessageList'
	},
	output: {
		path: __dirname + '/dist',
		filename: 'app.bundle.js'
	},
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader'
		},{
			test: /tests.*\.js$/,
			loader: 'mocha-loader!babel-loader'
		},{
			test: /node_modules\/jsdom/,
			loader: 'null-loader'
		}]
	},
	plugins: [
		new RewirePlugin()
	]
};
