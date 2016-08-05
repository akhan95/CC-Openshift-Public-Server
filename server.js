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

app.use(express.static(__dirname + '/views'));
//Create a server
server.listen(port);

console.log("server is running at port: "+ port);

//this is where it gets the mongo db server
mongoose.connect(mongoURL, function(err){
	if(err)
	{
		console.log(err);
	}else{
		console.log("connected to mongodb");
	}
});
//this is the answer that gets submitted
var answerSchema= mongoose.Schema({
	email: String,
	QueID:String,
	key:String,
	contextGroup:String,
	Question: String,
	Answer: String,
	Created: Date,
	Updated: Date
});
var answer = mongoose.model("answer",answerSchema);
//this is the socket io which connects the front end to the back end
io.sockets.on('connection', function(socket){
	//checks if the server is runnning
	console.log("socket io is running");
	//this saves the answer to the server
	socket.on('save Answer', function(data){
		//crates a new variable
		var newanswer = new answer({
			email: data.email,
			QueID:data.Question.queId,
			key:data.correctAns,
			contextGroup:data.Question.contextGroup1,
			Question: data.Question.question,
			Answer: data.thierAns,
			Created: null,
			Updated: null
        });
        console.log(newanswer);
        //sends to load the front end
        console.log(data);
		io.sockets.emit('save Answer', data);

        console.log(newanswer)
        newanswer.save(function (err) {
            if (err)
                throw err;

			io.sockets.emit('Add To display', data);

        });

	});
	//dis getst the entire answers back
	socket.on('display Answer', function(data){
		console.log("The array");

        console.log(data);
        //display the front ends
		io.sockets.emit('display Answer', data);
	});
	//checks if the server wrks properly
	socket.on('server function', function(data){
		console.log("client called the server");
		
		io.sockets.emit('client function', {});

	});
});

