var http = require('http'),
	fs = require('fs'),
	path = require('path'),
	url = require('url');
// var d3 = require('./mbostock-bower-d3-bower/d3.js');
var PORT = 1337,
	localhost = '127.0.0.1',
	_dirname = '.';

// Approaches
// 1. Run program then read stream file
// 2. Run program stores object in memory

// Stringified JSON
// var d3Data = fs.readFileSync('./d3Data.json', 'utf8');

// Optional
// https://docs.nodejitsu.com/articles/advanced/streams/how-to-use-fs-create-read-stream/

// utils
function fileType(url) {
	return url.split('.').pop();
}

function setHeaderObj(fileType, req, res) {
	var headerObj = {
	    'Access-Control-Allow-Origin': 'http://127.0.0.1:1337, http://localhost:1337',
	    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
	    'Access-Control-Allow-Headers': 'Content-type, Authorization, x-jpmc-csrf-token, x-jpmc-client-request-id',
	    'Access-Control-Allow-Credentials': 'true'
	};

	if(fileType(req.url) === 'json') {
		headerObj['Content-Type'] = 'application/json';
		res.writeHead(200, headerObj)
	} else if (fileType(req.url) === 'html') {
		headerObj['Content-Type'] = 'text/html';
		res.writeHead(200, headerObj)
	} else if (fileType(req.url) === 'js') {
		headerObj['Content-Type'] = 'text/javascript';
		res.writeHead(200, headerObj);
	  // Unknown type
	} else {
	  // res.writeHead(404, headerObj);
	  res.statusCode = 404;
	}
}

// Optional DIY promise
http.createServer(function(req, res) {
  	// Chrome automatically sends a requests for favicons
  	// Looks like https://code.google.com/p/chromium/issues/detail?id=39402 isn't
  	// fixed or this is a regression.
  	if(req.url.indexOf('favicon.ico') != -1) {
    	res.statusCode = 404;
    	res.end();
    	return;
  	}

	var uri = url.parse(req.url).pathname;
	if (uri === '/') {
		uri = '/index.html';
	}
  	// process cwd returns current working director
  	var filename = path.join(process.cwd(), uri);

  	console.log(uri);
  	var filepath = __dirname + req.url;

  	fs.exists(filename, function(exists) {
  		if(!exists) {
  			// set 404
  			setHeaderObj(fileType, req, res);
  			res.end();
  		} else {
		  	var file = fs.readFile(filepath, 'utf8', function read(err, data) {
		  	if (err) { throw err; }
		  		setHeaderObj(fileType, req, res);
		  		res.end(data);
		  	});  	
  		}
  	});

}).listen(PORT, localhost, function() {
	console.log(localhost + ':' + PORT);
});