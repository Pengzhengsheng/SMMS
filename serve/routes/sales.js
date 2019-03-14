// 引入token验证模块
const router = require('./jwt');

// 引入数据库连接模块
const connection = require('./connection');

// 接收销售统计的请求 /salesechars
router.post('/salesechars', (req, res) => {
	// 编写sql语句
	const sqlStr = `select * from sales`;
	
	// 执行sql语句
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		res.send(data);
	})
})

// 接收通过日期范围查询数据 /searchDate
router.get('/searchDate', (req, res) => {
	// 接收数据
	let { searchDateArr } = req.query;
	
	// 编写sql语句
	const sqlStr = `select * from sales where ctime between '${searchDateArr[0]}' and '${searchDateArr[1]}'`;
	
	// 执行sql语句
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		res.send(data);
	})
})

module.exports = router;
