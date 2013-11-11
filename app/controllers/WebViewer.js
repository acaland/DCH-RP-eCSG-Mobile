var url = arguments[0].url;


var net = require('net');



$.pbar.show();
var xhr = Ti.Network.createHTTPClient({timeout: 3000, autoRedirect: false});
xhr.onload = function() {
		Ti.API.info("redirect found");
		Ti.API.info(xhr.location);

		var redirectUrl = xhr.getResponseHeader("Location");
		Ti.API.info(redirectUrl);
		
		var urlTokens = url.split("/");
		var	filename = urlTokens[urlTokens.length-2];

		if (redirectUrl) {
			//$.pbar.show();
			download(redirectUrl, filename);
		} else {
			$.pbar.hide();
			$.wv.show();
			$.wv.data = xhr.responseData;
		}
};

xhr.ondatastream = function(e) {
		Ti.API.info(e.progress);
		$.pbar.value = e.progress;
};

xhr.onerror = function(e) {
	Ti.API.info(JSON.stringify(e));
	Ti.API.info(xhr.responseText);
	Ti.API.info(xhr.location);
	//Ti.API.info(xhr.responseData);
	alert(e);
};

xhr.open('GET', url);
//Ti.API.info("URL : " + url);
//Ti.API.info("cookie : " + net.shibCookie);
xhr.setRequestHeader("Cookie", net.shibCookie);
xhr.send();

function download(url, filename) {
	var xhr = Ti.Network.createHTTPClient({timeout: 3000});
	xhr.onload = function() {
		
		

		var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, filename);
		//Ti.API.info(Ti.Filesystem.applicationDataDirectory);
		f.write(this.responseData);
		$.pbar.hide();
		Ti.API.info(Ti.Filesystem.applicationDataDirectory + filename);
		$.wv.show();
		$.wv.url = Ti.Filesystem.applicationDataDirectory + filename;
		
	};

	xhr.ondatastream = function(e) {
		Ti.API.info(e.progress);
		$.pbar.value = e.progress;
	};

	xhr.onerror = function(e) {
		Ti.API.info(JSON.stringify(e));
		Ti.API.info(xhr.responseText);
		Ti.API.info(xhr.location);
		//Ti.API.info(xhr.responseData);
		alert(e);
	};


	xhr.open('GET', url);
	Ti.API.info("URL : " + url);
	//Ti.API.info("cookie : " + net.shibCookie);
	//xhr.setRequestHeader("Cookie", net.shibCookie);
	xhr.send();
}


//$.wv.evalJS("document.cookie='" + net.shibCookie + "';");
//$.wv.url = url;



