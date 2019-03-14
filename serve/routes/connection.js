// 引入mysql
const mysql = require('mysql');

// 使用mysql模块创建数据库连接对象
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'smms'
});

// 连接
connection.connect(() => {
	console.log('数据库连接成功');
});

// 暴露
module.exports = connection;
