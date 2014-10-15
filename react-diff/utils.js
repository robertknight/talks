var measureDOMChanges = function(callback) {
	React.addons.Perf.start();
	callback();
	setTimeout(function() {
		React.addons.Perf.stop();
		React.addons.Perf.printDOM();
	}, 200);
};


