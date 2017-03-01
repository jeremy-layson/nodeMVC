var port = 80;

var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var router = require('./framework/router.js');

var cache = {};

function serveStatic(response, cache, absPath) {
	if (cache[absPath]) {
		sendFile(response, absPath, cache[absPath]);
	} else {
		fs.exists(absPath, function(exists) {
			if (exists) {
				fs.readFile(absPath, function(err, data) {
					if (err) {
						send404(response);
					} else {
						cache[absPath] = data;
						sendFile(response, absPath, data);
					}
				});
			} else {
				send404(response);
			}
		});
	}
}

function send404(response) {
	response.writeHead(404, {'Content-Type': 'text/plain'});
	response.write('Error 404: resource not found.');
	response.end();
}

function sendFile(response, filePath, fileContents) {
	response.writeHead(
		200,
		{"content-type": mime.lookup(path.basename(filePath))}
	);

	response.end(fileContents);
}

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	var filePath = router.route(req.url);

	var absPath = './' + filePath;
	console.log(absPath);
	serveStatic(res, cache, absPath);

}).listen(port, function(){
	console.log("Server listening on port 127.0.0.1:" + port);
});