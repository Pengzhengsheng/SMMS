var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.send('后端服务器根目录');
});

module.exports = router;
