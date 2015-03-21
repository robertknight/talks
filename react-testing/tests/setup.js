import Q from 'q';

export default function setup() {
	if (typeof document !== 'undefined') {
		return Q();
	}

	var jsdom = require('jsdom');
	var ready = Q.defer();
	jsdom.env({
		html: '<html><body><div id="app"></div></body></html>',
		done: (errors, window) => {
			global.document = window.document;
			global.window = window;
			global.navigator = window.navigator;

			ready.resolve(window);
		}
	});
	return ready.promise;
}

