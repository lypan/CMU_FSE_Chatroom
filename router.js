var express = require('express')
var path = require('path');
var router = express.Router()

// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/login.html'));
})

router.post('/login', function(req, res) {
  var account = req.body.account;
  var password = req.body.password;

  console.log(account);
  console.log(password);

});

router.get('*', function(req, res){
  res.send('what???', 404);
});

module.exports = router
