//Lets require/import the HTTP module
var express = require('express'),
	app = express(),
	server= require('http').createServer(app),
	io= require('socket.io').listen(server),
	mongoose = require('mongoose'),
	path = require('path'),
	fs = require('fs'); // required for file serving

//Lets define a port we want to listen to
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

app.use(express.static(__dirname + '/public'));
//Create a server
server.listen(port);
console.log("server is running at port: "+port);

