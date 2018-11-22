// Dependency
var http = require('http');
var url = require('url');
var config = require('./config');

var httpServer = http.createServer(function (req, res) {

	// Get the url
	var parsedUrl = url.parse(req.url, true);

	// Get the path and trim slashes
	var path = parsedUrl.pathname.replace(/^\/+|\/$/g, '');

	// Read in the data
	req.on('data', function (data) {
		// we don't care about the payload
	});

	// Respond once request has been fully read
	req.on('end', function () {

		// Choose handler or default to notFound
		var chosenHandler = router[path] || handlers.notfFound;

		// Construct the data object to send to the handler
		var data = {
			path: path
		};

		// Route the request to the specified handler
		chosenHandler(data, function (statusCode, payload) {

			// Set default statusCode and payload if undefined or wrong type
			statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
			payload = typeof(payload) === 'object' ? payload : {};

			// Convert payload to a string
			var payloadString = JSON.stringify(payload);

			// Return the response
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);

			// Log the requested path
			console.log('Returning', statusCode, payloadString);
		});

	});
});

// Listen on defined port
httpServer.listen(config.httpPort, function () {
	console.log('Server is listening on port ' + config.httpPort);
});

// Define the handlers
var handlers = {};

// Hello handler
handlers.hello = function (data, callback) {
	// Callback a http status code and payload object
	callback(200, {'message': 'Hello from the other side.'});
};

// Not found handler
handlers.notfFound = function (data, callback) {
	callback(404);
};

// Define a request router
var router = {
	'hello': handlers.hello
};