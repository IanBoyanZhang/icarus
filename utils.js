(function(namespace) {
	function httpGetAsync(theUrl, callback) {
		var xmlHttp = new XMLHttpRequest();

		xmlHttp.onreadystatechange = function() {
		   if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
		   	// callback(xmlHttp.responseText);
		   	callback(xmlHttp);
		   }
		};
		xmlHttp.open("GET", theUrl, true);
		// xmlHttp.send(null);
		xmlHttp.send();
	}

	namespace.$ = {
		httpGetAsync: httpGetAsync
	};

})(window);