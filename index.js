//Constants
const port = 49153;

//NPMs
var http = require('http');
var express = require('express');
var socket = require('socket.io');
const cors = require('cors');    
var bodyParser = require('body-parser');

//Controllers
var controller = require('./controller');

var app = express();
var server = http.createServer(app);
var socketListener = socket.listen(server);


// Use body-parser to get POST requests for API use
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Use CORS
app.use(cors());

//Route
app.post('/upFile', controller.videoUploader);


//Static Folder Hosting
app.use("/scs", express.static(__dirname + "/screenshots"));


//Socket Initialize

//SOCKETs
socketListener.on('connection', function(connection) {
    console.log('connection established');
});

socketListener.on('disconnect', function(connection) {
});

exports.socketListener = socketListener;
//Server Start
server.listen(port,function(){
   console.log('connected');
});


