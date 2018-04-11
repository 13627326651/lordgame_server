// StateCode:
// 199: Unknow Error
// 200-209:注册
// 200：注册成功
// 201：用户已经存在，无法重新注册

// 210-220：登陆
// 210：登录成功
// 211：密码错误
// 212：用户不存在，无法登录

//230-
//230: 数据库查询失败
//231: 数据库插入失败

//240-
//240 : 用户名或密码为空


function checkUser(pathname, user, connection, handler){		
	if(!user.username || !user.password){
		console.log('240 用户名或密码为空');
		handler('240');
		return;
	}
	var sql = 'select * from user where username = ?';
	var sqlPara = [user.username];
	connection.query(sql, sqlPara, function(err, result){	
		if(err){
			console.log('[Query Error] 230');
			handler('230 ');		
			return;
		}
		//存在该用户
		if(result.length > 0){
			if(pathname == '/register'){		
				console.log('201 用户已经存在，无法重新注册');
				handler('201');				
			}
			if(pathname == '/login'){
				if(user.password == result[0].password){
					console.log('210 登录成功');
					handler('210');					
				}else {
					console.log('211 密码错误');
					handler('211');
				}
			}		
		//不存在该用户
		}else{
			if(pathname == '/register'){				
				var sql = "insert into user (username, password, date) values (?, ?, ?)";
				var sqlPara = [user.username, user.password, '2018-4-10 23:48'];
				connection.query(sql, sqlPara, function(err, re){
					if(err){							
						console.log('[Insert Error] 231');						
						handler('231');
						return;
					}
					console.log('200 注册成功');
					handler('200');
				});
			}
			if(pathname == '/login'){
				console.log('212 用户不存在，无法登录');
				handler('212');				
			}
		}
	});
};

exports.checkUser = checkUser;