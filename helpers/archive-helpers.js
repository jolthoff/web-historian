var fs = require('fs');
var path = require('path');
var request = require('/Users/student/2015-08-web-historian/node_modules/http-request/lib/main.js');
var _ = require('underscore');
// var http = request.createHttpClient({"url": __dirname + '/web/archives/'});

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../web/archives/sites'),
  list: path.join(__dirname, '../web/archives/sites.txt'),
  archivesHome: path.join(__dirname, '../web')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {

	fs.readFile(exports.paths.list, 'utf-8', function(err, data) {
		if (err) { console.log('error', err); }
		callback(data.split('\n'));
	})
};

exports.isUrlInList = function(url, callback) {

	exports.readListOfUrls(function(list) {
		list.forEach(function(site) {
			if (site !== url) {
				callback(url)
			}
		})
	})
};

exports.addUrlToList = function(url) {

	exports.isUrlInList(url, function(url){
		fs.appendFile(exports.paths.list, url, function(err) {
			if (err) {console.log("error " + err)}

		})
	})
};

exports.isUrlArchived = function(url, doesntExistCallback, doesExistCallback) {


	fs.exists(exports.paths.archivedSites + '/' + url, function(exists) {
		if (!exists) {
			doesntExistCallback(url);
		} else {
			doesExistCallback(url);
		}
	})
};

exports.downloadFile = function(url) {

	fs.mkdir(exports.paths.archivedSites + '/' + url, function() {
		fs.writeFile(exports.paths.archivedSites + '/' + url + '/index.html', function() {
			request.get({'url': url}, exports.paths.archivedSites + '/' + url + '/index.html', function(err, response) {
				if (err) { console.log("error " + err)}
			})
		})
	})
}

exports.downloadUrls = function() {

	exports.readListOfUrls(function(list) {
		list.forEach(function(url) {
			exports.isUrlArchived(url, function(url){
				exports.downloadFile(url)
			}, function() {})
		})
		fs.writeFile(exports.paths.list, '', function(err) {
			if (err) {console.log(err)}
		})
	})
	// fs.readFile(exports.paths.list, 'utf-8', function(err, data) {
	// 	if (err) { console.log("error " + err) }
	// 	console.log(data)
	// 	var listUrls = data.split('\n');

		// listUrls.forEach(function(url) {
		// 	if (!exports.isUrlArchived(url)) {
		// 		fs.mkdirSync(exports.paths.archivedSites + '/' + url)
		// 		fs.writeFileSync(exports.paths.archivedSites + '/' + url + '/index.html')
		// 		request.get({"url": url}, exports.paths.archivedSites + '/' + url + '/index.html', function(err, res) {
		// 			if (err) { console.log(err); }
		// 			console.log(res.code, res.header, res.file)
		// 		})
		// 	}
		// })
	// })
	
	
};
