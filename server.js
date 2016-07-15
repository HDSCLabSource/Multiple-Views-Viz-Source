var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var protocol = require('http');
var path = require('path');
var fs = require('fs');
var server = express();

server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'jade');
server.use(express.favicon());
server.use(express.bodyParser({
	keepExtensions: true,
	limit: 100000,
	uploadDir: __dirname +'/temp' }));
server.use(express.logger('dev'));
server.use(express.json());
server.use(express.urlencoded());
server.use(express.methodOverride());
server.use(server.router);


if ('development' == server.get('env')) {
	server.use(express.errorHandler());
}
server.get('/', routes.index);
server.post("/uploadFile", function (req, res) {

	var filename=req.files.file.name;
	var extensions=[".csv",".json"];
	var msg="";
	var i = filename.lastIndexOf('.');
	var tmp_path = req.files.file.path;
	var target_path = __dirname +'/uploadFile/' + req.files.file.name;
	var file_extension= filename.substr(i);
	if(file_extension in acceptedExtentions(extensions)){
		fs.rename(tmp_path, target_path, function(err) {
			if (err) throw err;

			fs.unlink(tmp_path, function() {
				if (err) throw err;
			});
		});
		msg="File uploaded sucessfully"
	}else{

		fs.unlink(tmp_path, function(err) {
			if (err) throw err;
		});
		msg="File upload failed.Please upload CSV or JSON file";
	}
	res.end(msg);
});
function acceptedExtentions(a){
	var o = {};
	for(var i=0;i<a.length;i++)
	{
		o[a[i]]='';
	}
	return o;
}

protocol.createServer(server).listen(3000);
console.log('The server is now running at port 3000');