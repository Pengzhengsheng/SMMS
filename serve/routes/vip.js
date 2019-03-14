// 引入token验证模块
const router = require('./jwt');

// 引入数据库连接模块
const connection = require('./connection');

// 接收添加会员数据 /vipadd
router.post('/vipadd', (req, res) => {
	// 接收前端传来的参数
	let { name, vipcardid, usergroup, idcard, userstatus,
		  tel, seatnum, email, region, adress, postalcode } = req.body;
			
	// 设置默认值(数据库字段设置int型的值如果为空会报错)
	idcard = idcard ? idcard : -1;
	tel = tel ? tel : -1;
	seatnum = seatnum ? seatnum : -1;
	email = email ? email : -1;
	region = region ? region : -1;
	adress = adress ? adress : -1;
	postalcode = postalcode ? postalcode : -1;
			
			
	// 把数据写入数据库
	// 写sql语句
	const sqlStr = `insert into viplist(name, vipcardid, usergroup, idcard, userstatus, tel, seatnum, email, region, adress, postalcode) values('${name}', ${vipcardid}, '${usergroup}', '${idcard}', '${userstatus}', ${tel}, ${seatnum}, '${email}', '${region}', '${adress}', ${postalcode})`;


	// 执行sql语句
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		// 判断如果受影响行数大于0 就是成功，否则就失败
		if(data.affectedRows > 0){
			// 成功
			res.send({ code: 0, reason: '添加账号成功'});
		} else {
			// 失败
			res.send({ code: 1, reason: '添加账号失败'});
		}
	})
})

// 接收账号列表请求 /viplist
router.post('/viplist', (req, res) => {
	// 去数据库查询所有数据
	const sqlStr = `select * from viplist order by id desc`;
	
	//执行sql语句
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		//把数据返回给前段端
		res.send(data);
	})
})

// 接收账号列表删除请求 /vipdel
router.get('/vipdel', (req, res) => {
	// 接收前端传过来的数据
	let { id } = req.query;
	
	// 写sql语句
	const sqlStr = `delete from viplist where id=${id}`;
	
	// 执行sql语句
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		// 判断
		if (data.affectedRows > 0) {
			// 成功
			res.send({ code: 0, reason: '数据删除成功'});
		} else {
			// 失败
			res.send({ code: 1, reason: '数据删除失败'});
		}
	})
})

// 接收修改账号请求 /vipupdate
router.get('/vipupdate', (req, res) => {
	// 接收前端传过来的数据
	let { id } = req.query;
	
	// 写sql语句
	const sqlStr = `select * from viplist where id=${id}`;
	
	// 执行sql语句
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		// 把数据发送给前端
		res.send(data[0]);
	})
})

// 保存账号请求 /vipsave
router.post('/vipsave', (req, res) => {
	// 接收前端传过来的数据
	let { vipcardid, name, usergroup, tel, seatnum, id } = req.body;
	
	// 写sql语句
	const sqlStr = `update viplist set vipcardid=${vipcardid}, name='${name}', usergroup='${usergroup}', tel=${tel}, seatnum=${seatnum} where id=${id}`;
	
	// 执行sql语句
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		
		// 判断
		if(data.affectedRows > 0){
			// 成功
			res.send({ code: 0, reason: '修改数据成功'});
		} else {
			// 失败
			res.send({ code: 1, reason: '修改数据失败'});
		}
	})
})

// 批量删除请求 /vipBatchDel
router.get('/vipBatchDel', (req, res) => {
//	 接收数据
	let { idArr } = req.query;

//	编写sql语句
	const sqlStr = `delete from viplist where id in (${idArr})`;

	// 执行sql语句
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;

		// 判断
		if (data.affectedRows > 0){
			// 成功
			res.send({ code: 0, reason: '批量删除成功'});
		} else {
			// 失败
			res.send({ code: 1, reason: '批量删除失败'});
		}
	})
})

// 分页显示数据请求 /getlistbypage
router.post('/getlistbypage', (req, res) => {
	// 获取数据
	let { currentPage, pageSize } = req.body;

	// 编写sql语句
	let sqlStr = `select * from viplist order by id desc`;

	// 执行sql语句
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;

		// 获取数据的总条数
		let total = data.length;

		// 跳过多少页
		let n = (currentPage - 1) * pageSize;

		// 编写sql语句
		sqlStr += ` limit ${n}, ${pageSize}`;

		// 执行sql语句
		connection.query(sqlStr, (err, data) => {
			if (err) throw err;

			// 把数据传给前端
			res.send({total, data});
		})
	})
})

module.exports = router;
