//引入jwt
const router =  require('./jwt');
// 引入数据库连接模块
const connection = require('./connection')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//接收入库的请求
router.post('/insertlibrary',(req,res)=>{
	//接收前端传过来的参数
	let {barcode,num,purchaseprice}=req.body;
	//写sql语句
	let sqlStr=`insert into stock (name,price,bid,barCodeBtn) values ('',${purchaseprice},${num},'${barcode}')`;
   //	console.log(sqlStr)
//写入数据
	connection.query(sqlStr,(err,data)=>{
		if(err) throw err;
		if (data.affectedRows > 0) {
			// 返回成功的提示信息
			res.send({code: 0, reason: '入库成功'});
		} else {
			// 返回失败的提示信息
			res.send({code: 1, reason: '入库失败'});
		}
	})
})

//查询数据的请求
router.get('/searchdata',(req,res)=>{
	//接收参数
	let {selectname,keyword}=req.query;
//	console.log(selectname,keyword)
//写sql语句
let sqlStr=`select * from stock where 1=1 `
//考虑到多种条件的影响，需要考虑用户设置的各种参数所以条件按照由大到小来写
//定义一个变量来保存总数据条数
//首先排除用户没进行筛选的情况，就是排除默认以后在进行筛选
if(selectname!=="全部" && selectname!==''){
	//进行数据库语句的拼接 类别的拼接
	sqlStr+=` and sareHousing='${selectname}'`
}
if(keyword!==''){
	sqlStr+=`and (name like '%${keyword}%' or barCodeBtn like '%${keyword}%')`
}
//拼接sql进行数据排序
sqlStr+=`order by ctime desc`
//console.log(sqlStr)
//执行sql语句
connection.query(sqlStr,(err,data)=>{
	if(err) throw err;
	res.send(data)
	console.log(data)
})
})

//库存的分页请求
router.get('/getdatabyPages',(req,res)=>{
	//接收数据
	
	let{pagesize,currentpage,selectname,keyword}=req.query;
	//写sql语句
	let sqlStr=`select * from stock where 1=1`;//查询所有的数据
//	console.log(sqlStr);
//定义数据总条数
let total;
//执行sql语句
if(selectname!=="全部" && selectname!==''){
	//进行数据库语句的拼接 类别的拼接
	sqlStr+=` and sareHousing='${selectname}'`
}
if(keyword!==''){
	sqlStr+=` and (name like '%${keyword}%' or barCodeBtn like '%${keyword}%' )`
}
	//执行sql语句去拿数据
	connection.query(sqlStr,(err,data)=>{
		if(err) throw err;
		//返回页面总条数以及对应的页面数据
//		console.log(data)
		total=data.length;
	})
	//	console.log(data);
	sqlStr+=` order by ctime desc`;
	//计算跳过多少条
	let num=(currentpage-1)*pagesize;
	//sql拼接
	sqlStr+=` limit ${num}, ${pagesize}`;
	connection.query(sqlStr,(err,data)=>{
		if(err) throw err;
		res.send({total,data});
  });
})
module.exports = router;
