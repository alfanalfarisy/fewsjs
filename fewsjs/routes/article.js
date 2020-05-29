var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/banjir', function(req, res, next) {
  title='FEWS | Info'
  res.render('article/banjir',{title:title});
});
router.get('/subscribe', function(req, res, next) {
  title='FEWS | Subs'
  res.render('article/subscribe',{title:title});
});



module.exports = router;
