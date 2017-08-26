var express = require('express')
var path = require('path');
var session = require('express-session');
var mongoose = require('mongoose');
var database = ["Jason", "David"];

var router = express.Router()

router.use(session({
  secret: "Account",
  resave: false,
  saveUninitialized: true,
}))


router.get('/', function(req, res) {
  // req.session.destroy();
  if(req.session)console.log(req.session);
  if (req.session) res.redirect('/chatroom');
  else res.redirect('/login');
})

router.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname + '/login.html'));
});

router.post('/login', function(req, res) {
  var account = req.body.account;
  var password = req.body.password;

  var queryResult = database.find((name) => {
    return name == account;
  });

  if (queryResult) {
    console.log("log in!");
    req.session.account = account;
    res.redirect('/chatroom');
  }

  router.get('/chatroom', function(req, res) {
    console.log(req.session.account);
    res.sendFile(path.join(__dirname + '/chatroom.html'));
  });
});


module.exports = router
