//引入jwt
const router =  require('./jwt');
// 引入数据库连接模块
const connection = require('./connection')

/* 接收添加账号请求： /accountadd  */ 
router.post('/accountadd', (req, res) => {
	// 接收前端参数
	let {account, password,usergroup} = req.body;
	// 把数据存入数据库
	// 写sql语句
	const sqlStr = `insert into account(account, password, usergroup) values('${account}', '${password}', '${usergroup}')`;

	// 执行sql语句
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		// 判断如果首影响行数大于0 就是成功 否则就是失败
		if (data.affectedRows > 0) {
			// 返回成功的提示信息
			res.send({code: 0, reason: '添加账号成功'});
		} else {
			// 返回失败的提示信息
			res.send({code: 1, reason: '添加账号失败'});
		}
	})
})
/* 接收账号列表请求： /accountlist  */ 
router.get('/accountlist', (req, res) => {
	// 去数据库查询所有数据
	// 写sql语句
	const sqlStr = `select * from account order by ctime desc`; // 根据时间降序
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		res.send(data); // 把查询到的所有账号数据返回给前端
	})
})

/* 接收删除请求： /accountdel */ 
router.get('/accountdel', (req, res) => {
	// 接收id
	const { id } = req.query;

	// 写sql语句
	const sqlStr = `delete from account where id=${id}`;
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		// 判断
		if (data.affectedRows > 0) {
			// 返回成功的提示信息
			res.send({code: 0, reason: '删除账号成功'});
		} else {
			// 返回成功的提示信息
			res.send({code: 1, reason: '删除账号失败'});
		}
	})
})


/* 接收修改数据回显的请求: /accountedit */ 
router.get('/accountedit', (req, res) => {
	// 接收id
	const { id } = req.query;

	// 写sql语句
	const sqlStr = `select * from account where id=${id}`;
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		res.send(data[0]) // 把查询到的数据返回给前端
	})
})

/* 接收保存修改的请求： /accounteditsave */ 
router.post('/accounteditsave', (req, res) => {
	// 接收新数据和原来的id
	let { account, usergroup, id } = req.body;

	// 写sql语句
	const sqlStr = `update account set account='${account}', usergroup='${usergroup}' where id=${id}`;
	// 执行sql语句
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		// 判断
		if (data.affectedRows > 0) {
			// 返回成功的提示信息
			res.send({code: 0, reason: '修改账号成功'});
		} else {
			// 返回成功的提示信息
			res.send({code: 1, reason: '修改账号失败'});
		}
	})
})

//接收批量修改的请求
router.get('/batchdel',(req,res)=>{
	//接收传过来的id
	let { idArr } = req.query;
	// 写sql语句
	const sqlStr = `delete from account where id in (${idArr})`;

	// 执行sql语句
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		// 判断
		if (data.affectedRows > 0) {
			res.send({code: 0, reason: '批量删除成功'})
		} else {
			res.send({code: 1, reason: '批量删除失败'})
		}
	})
})

/* 接收分页请求： /getdatabypage */ 
router.get('/getdatabyPage', (req, res) => {
	// 接收分页条件
	let { pagesize, currentpage } = req.query;
	// 写sql语句
	let sqlStr = `select * from account order by ctime desc`;
	// 执行sql语句
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		let total = data.length; // 数据总条数
		// 跳多少条
		let n = (currentpage - 1) * pagesize;
		// 写sql语句
		sqlStr += ` limit ${n}, ${pagesize}`;

		// 查询对应页码的数据
		connection.query(sqlStr, (err, data) => {
			if (err) throw err;
			res.send({total, data}); // 把数据总条数和每页对应数据给前端
		});
	})
})
// 接收获取用户名和头像的请求 /getNameAndAvatar
router.get('/getNameAndAvatar', (req, res) => {
	// 查找当前用户的id 
	const { account, id } = req.user;
	
	// 编写sql语句查找当前用户的头像
	const sqlStr = `select * from account where id=${id}`;
	
	// 执行sql语句
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		
		const avatar = data[0].avatar || '/upload/default.jpg';
		res.send({name: account, avatar});
	})
	
})
//修改密码时与原密码进行比对
router.get('/oldpassword',(req,res)=>{
	//接收前端穿过来的参数
	let {oldpassword}=req.query;
//	console.log(oldpassword);
//判断是否和数据库的密码一致
//console.log(req.user)
	if(oldpassword===req.user.password){
		res.send({code:0,reason:'验证通过'});
	}else{
		res.send({code:1,reason:'密码不一致'});
	}
})
//修改密码
router.post('/updatepwd',(req,res)=>{
	//接收参数
	let {newpassword}=req.body;
//	console.log(newpassword)
	//获取需要修改密码的用户的id
	let {id}=req.user;
//	console.log(id)
	//定义sql语句
	const sqlStr=`update account set password='${newpassword}' where id=${id}`;
	//执行sql语句
//	console.log(sqlStr)
	connection.query(sqlStr,(err,data)=>{
		console.log(data)
		if(err) throw err;
		if(data.affectedRows>0){
			res.send({code:0,reason:'修改密码成功'});
		}else{
			res.send({code:1,reason:'修改密码失败'});
		}
	})
})

/* 头像上传 */
const multer = require('multer');

// 配置存储路径
const storage = multer.diskStorage({
	destination: 'public/upload', // 文件上传到服务器要放入的目录
	// 文件名重命名
	filename: (req, file, cb) => {
		var fileFormat = (file.originalname).split('.'); // 把文件名变为数组
		var filename = new Date().getTime(); // 获取当前的时间戳
		cb(null, filename + '.' + fileFormat[fileFormat.length - 1]);
	}
});

// 上传头像
const upload = multer({
	storage
});


// 接收上传头像请求 /uploadavatar
router.post('/uploadavatar', upload.single('file'), (req, res) => {
	// 获取文件名
	let { filename } = req.file;
	// 获取用户id
	let { id } = req.user;
	
	// 拼接图片路径
	let imgUrl = `/upload/${filename}`;
	// 编写sql语句
	const sqlStr = `update account set avatar='${imgUrl}' where id=${id}`;
	
	// 执行sql语句
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		if (data.affectedRows > 0) {
			res.send({ code: 0, reason: '上传头像成功', imgUrl});
		} else {
			res.send({ code: 1, reason: '上传头像失败'});
		}
	})

})
module.exports = router;
