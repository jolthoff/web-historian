var http = require("http");
var handler = require("./request-handler");
var initialize = require("./initialize.js");
var worker = require('../workers/htmlfetcher.js');
var helpers = require('../helpers/archive-helpers.js');
var mysql = require('mysql');
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database(':memory:');

console.log(db)
// Why do you think we have this here?
// HINT: It has to do with what's in .gitignore
initialize("./archives");

var port = 8080;
var ip = "127.0.0.1";

console.log(mysql)

var connection = mysql.createConnection({
	socketPath: '/tmp/mysql.sock',
	host: ip,
	database: 'MyAwesomeDB'
})

connection.connect();

connection.query('CREATE TABLE OurAwesomeTreasure (pixiePony VARCHAR(100), Other_column VARCHAR(100),' +
                 'Out_of_names VARCHAR(100),POOP VARCHAR(100), PRIMARY KEY(Pixie_Pony))',
	function(err, result){
	    // Case there is an error during the creation
	    if(err) {
	        console.log("we errored out " + err);
	    } else {
	        console.log("Kaboom");
	    }
	});
var server = http.createServer(function(req, res) {
	console.log('Calling method ' + req.method + ' on ' + req.url);
	handler.handleRequest(req, res);
	// if (routes[req.url]) {
	// 	routes[req.url](req, res);
	// } else {
	// 	res.writeHead(404, {'Content-Type':'text/plain'});
	// 	res.end();
	// }
});

if (module.parent) {
  module.exports = server;
} else {
  server.listen(port, ip);
  console.log("Listening on http://" + ip + ":" + port);
}

routes = {
	'/': handler.handleRequest,
	'/sites/post': handler.handleRequest
}