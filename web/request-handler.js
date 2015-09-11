var path = require('path');
var fs = require('fs');
var helpers = require('../helpers/archive-helpers');
// require more modules/folders here!

var action = {
	"GET": function(req, res) {
		var url = '';
		if (req.url === '/') {
			url = helpers.paths.siteAssets + '/index.html';
		} else if (req.url === '/public/loading.html') {
			url = helpers.paths.archivesHome + req.url;
		} else {

			// console.log(req.url)
			// var site = req.url.match('/(www)?([^/])+\.\w{2,3}[^index.html]/g');
			// console.log(site)
			// helpers.isUrlArchived(site.slice(0, site.length - 1), function() {
			// 	res.writeHead(404)
			// 	res.end()
			// }, function() {
				url = helpers.paths.archivesHome + req.url;

			// })
		}
		console.log('url', url);
		fs.readFile(url, 'utf-8', function(err, data) {
			if (err) {
				res.writeHead(404)
				res.end('404: Page not found');
			} else {
				res.writeHead(200, {'Content-Type': 'text/html'})
				res.end(data)
			}
		})
	},
	"POST": function(req, res) {
		var str = '';
		var data = '';
		req.on('data', function(chunk) {
			str = chunk.slice(4);
			data = chunk.slice(4) + '\n';
		});
		req.on('end', function() {
			fs.appendFile(__dirname + '/archives/sites.txt', data, function(err) {
				if (err) {
					throw err;
				}
			});
			// res.write(data);
			var url = req.url.slice(1);
			console.log("this is the post " + str)
			helpers.isUrlArchived(str, function() {exports.redirectToLoading(str, res);}, function() {exports.redirectToSite(str, res);});
		})

	}

}
exports.handleRequest = function (req, res) {
  // res.end(archive.paths.list);

  if(action[req.method]) {
  	action[req.method](req, res);
  }

};

exports.redirectToLoading = function(req, res) {
	res.writeHead(302, {'Location': 'http://127.0.0.1:8080/public/loading.html'})
	res.end();
}

exports.redirectToSite = function(req, res) {
	res.writeHead(302, {'Location': 'http://127.0.0.1:8080/archives/sites/' + req + '/index.html'})
	res.end();
}
