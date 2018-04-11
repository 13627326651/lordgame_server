var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');	
});

app.get('/register', function(req, res){
	res.end('/register');
});


server.listen(80, function(){
	console.log('server is listening at 80');
});

var id = 0;
io.on('connection', function(socket){
	console.log('a user connected');	
	socket.on('disconnect', function(){
		console.log('a user disconnected ' );
	});
	socket.on('chat message', function(msg){
		console.log('Msg: ' + msg);
		io.emit('chat message', msg);		
	});
});

		

