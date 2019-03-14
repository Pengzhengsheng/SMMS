//引入jwt
const router =  require('./jwt');
// 引入数据库连接模块
const connection = require('./connection')
/* GET users listing. */
router.get('/', function(req, res, next) {
res.send('respond with a resource');
});
// 登录的回车验证
router.get("/loginmain",(req,res)=>{
    // 接收前端的参数
    let {account,password}=req.query;
    // 写sql语句
    const sqlStr=`select * from account where (account='${account}' and password='${password}')`;
    // 执行sql语句
//  console.log(sqlStr);
    connection.query(sqlStr,(err,data)=>{
        if(err) throw err;
//      console.log(data);
		if(data.length>0){//D登录成功
			// 对象浅拷贝
			const userInfo = Object.assign({}, data[0]);
			//生成token
			const token = jwt.sign(userInfo, secretKey, {
			    expiresIn: 60*60*10// token过期时间
			})
//			console.log(token)
			res.send({code:0,reason:"密码验证通过",token});
		}else{
			res.send({code:1,reason:"密码输入错误"});
		}
        // res.send(data);
    })
})
/* 获取用户权限 */
router.get('/getroot', (req, res) => {
	// 获取用户分组
	let { usergroup } = req.user;
	//身份分组
	let roots = [];
	if (usergroup === '超级管理员') {
		roots.push('superaccount')
	} else if ( usergroup === '普通用户' ) {
		roots.push('ordinary')
	}

	res.send({roots});
//	console.log(roots);
}) 
module.exports = router;
