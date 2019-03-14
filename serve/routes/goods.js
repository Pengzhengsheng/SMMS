// 引入token验证模块
const router = require('./jwt');

// 引入数据库连接模块
const connection = require('./connection');

// 添加商品请求 //addgoods
router.post('/addgoods', (req, res) => {
  // 接收数据
  let { classification, barcode, name, price, marketprice, bid, number,
        weight, company, discount, ispromotion, introduce } = req.body;

  // 判断是否促销
  if (ispromotion === 'true') {
    // 如果要促销则促销价格为售价的0.8
    var promotion = price * 0.8;
  } else if (ispromotion === 'false') {
    // 如果不促销则促销价格等于售价
    var promotion =  price; 
  }

  // 库存总额为入库数量*进价
  let stockall = number * bid;

  // 销售总额为入库数量*促销价
  let saleall = number * promotion;

  // 设置默认值 -1 (数据库字段设置int型的值如果为空会报错)
  marketprice = marketprice ? marketprice : -1;
  bid = bid ? bid : -1;
  number = number ? number : -1;
  weight = weight ? weight : -1;
  weight = weight ? weight : -1;
  promotion = promotion ? promotion : -1;
  stockall = stockall ? stockall : -1;
  saleall = saleall ? saleall : -1;


  // 编写sql语句
  const sqlStr = `insert into goodslist(classification, barcode, name, price, marketprice, bid, number,
    weight, company, discount, ispromotion, introduce, promotion, stockall, saleall) values('${classification}',
    ${barcode}, '${name}', ${price},${marketprice}, ${bid}, ${number}, ${weight}, '${company}', '${discount}',
    '${ispromotion}', '${introduce}', ${promotion}, ${stockall}, ${saleall})`;

  // 执行sql语句
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    if (data.affectedRows > 0) {
      // 成功
      res.send({ code: 0, reason: '添加商品成功'});
    } else {
      // 失败
      res.send({ code: 1, reason: '添加商品失败'});
    }
  })
})

// 分页显示数据请求 /goodslistandsearch
router.post('/goodslistandsearch', (req, res) => {
  // 接收数据
  const { currentPage, pageSize, cateName, searchValue } = req.body;

  // 计算总条数
  // 编写sql语句
  let sqlStr = `select * from goodslist where 1=1`;
  
  // 分类判断
	if (cateName !== '全部' && cateName !== '') {
		sqlStr += ` and classification='${cateName}'`;
	}
	
	// 关键字判断
	if (searchValue !== '') {
		sqlStr += ` and (name like '%${searchValue}%' or barcode like '%${searchValue}%')`;
	}
  
  // 执行sql语句
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;

    // 获取数据总数
    let total = data.length;
    
		// 排序
		sqlStr += ` order by id desc`;
	
    // 计算跳过多少页
    let n = (currentPage - 1) * pageSize;
    
    // 编写sql语句
    sqlStr += ` limit ${n}, ${pageSize}`;

    // 执行sql语句
    connection.query(sqlStr, (err, data) => {
      if (err) throw err;
      res.send({data, total});
    })
  })
})

// 批量删除请求 /goodsbatchdel 
router.get('/goodsbatchdel', (req, res) => {
  // 接收数据
  let { id } = req.query;

  // 编写sql语句
  const sqlStr = `delete from goodslist where id in (${id})`;

  // 执行sql语句
  connection.query(sqlStr, (err, data) => {
    if (err) throw err;
    if (data.affectedRows > 0) {
      // 成功
      res.send({ code: 0, reason: '批量删除成功'});
    } else {
      // 失败
      res.send({ code: 1, reason: '批量删除失败'});
    }
  })
})

// 删除商品请求 /goodsdel
router.get('/goodsdel', (req, res) => {
	// 接收前端传过来的数据
	let { id } = req.query;
	
	// 写sql语句
	const sqlStr = `delete from goodslist where id=${id}`;
	
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

	/*  接收销售数据的请求/salesdata */ 
router.get('/salesdata', (req, res) => {
	// 准备一份报表数据
	// 写sql语句
	const sqlStr = `select * from dataarr where ctime between '2019-03-01 00:00:00' and '2019-03-08 00:00:00'`;
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		res.send(data) // 把数据返回给前端
		console.log(data)
	})
})



module.exports = router;
