
var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(80);
var count = 0;
function handler (req, res) {
	console.log('http ' + count++);
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }	
    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {
	console.log('socket ');
	
  io.sockets.emit('news', 'hello');
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
      