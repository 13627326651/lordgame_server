// StateCode:
// 200-209:注册
// 200：注册成功
// 201：用户已经存在，无法重新注册

// 210-220：登陆
// 210：登录成功
// 211：密码错误
// 212：用户不存在，无法登录


var sql = require('mysql');
var qs = require('querystring');
var url = require('url');
var login = require('./login');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var connection = sql.createConnection({
	host : 'localhost',
	port : '3306',
	user : 'root',
	password : '123456',
	database: 'lordgame'
});
connection.connect();
//处理post请求
function processPost(req, res){
	var pathname = url.parse(req.url).pathname;
	var data = '';
	req.on('data', function(chunk){
		data += chunk;
	});
	req.on('end', function(){
		var user = qs.parse(data);
		login.checkUser(pathname, user, connection, function(statecode){
				console.log('state code:' + statecode);				
				res.end(statecode);
			});	
	});
}
//处理Get请求
function processGet(req, res){
		
	var pathname = url.parse(req.url).pathname;
	var query = url.parse(req.url).query;
	var user = qs.parse(query);	
	login.checkUser(pathname, user, connection, function(statecode){
		console.log('state code:' + statecode);				
		res.end(statecode);
	});	
};

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});
app.post('/login',processPost);
app.post('/register',processPost);

app.get('/login',processGet);
app.get('/register',processGet);


server.listen(8888, function(err){
	if(!err){
		console.log('服务器启动成功，正在监听port8888...');
	}	
});

io.on('connection', function(socket){
	console.log('a user is connected');
	socket.on('chat message', function(data){
		console.log('recv data : ' + data);
		io.sockets.emit('chat message', data);
	});
});
io.on('disconnection', function(socket){
	console.log('a user is disconnected');
});

process.on('exit', function(code){
	console.log('eixt: ' + code);
	connection.end();
});
