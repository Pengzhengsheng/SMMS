var express = require('express');
var router = express.Router();
// 引入jwt
global.jwt = require('jsonwebtoken');

// expressJwt 用于验证token的有效性
const expressJwt = require('express-jwt');
// 秘钥
global.secretKey = 'peng';

// 拦截所有请求
router.all('*', (req, res, next) => {
	// 设置响应头解决跨域
	res.setHeader("Access-Control-Allow-Origin", "*");  // 允许的域
	res.setHeader("Access-Control-Allow-Headers", "authorization"); // 允许携带的请求头
	// 放行
	next()
})


// 使用中间件验证token合法性
router.use(expressJwt ({
    secret:  secretKey 
}).unless({
    path: ['/login/loginmain']  // 不需要验证token的地址
}))

// 拦截器
router.use(function (err, req, res, next) {
    // 如果用户的请求 没有携带token 那么错误类型是 UnauthorizedError
    if (err.name === 'UnauthorizedError') {   
        // 如果前端请求不带token 返回错误
        res.status(401).send('无效的token');
    }
})

module.exports = router;
