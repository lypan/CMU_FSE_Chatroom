var express = require('express')
var path = require('path');
var router = express.Router()
var mongoose = require('mongoose');

// router.use(function timeLog (req, res, next) {
//   // console.log('Time: ', Date.now())
//
//   next();
// })

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/login.html'));
})

router.post('/login', function(req, res) {
  var account = req.body.account;
  var password = req.body.password;
  // mongodb
  mongoose.connect('mongodb://admin:admin@ds036079.mlab.com:36079/chatroom');
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', function() {
    // we're connected!
    var userSchema = mongoose.Schema({
      account: String,
      password: String
    });
    var user = mongoose.model('user', userSchema);


    user.findOne({ 'account': account, 'password': password }, 'account password', function (err, user) {
      // if (err) return handleError(err);
      if(user && user.account && user.password){
        res.sendFile(path.join(__dirname + '/chatroom.html'));
      }
      else {
        res.send('Wrong account or password');
      }
    })
  });
});

router.get('/signup', function(req, res) {
  res.sendFile(path.join(__dirname + '/signup.html'));
})


router.post('/signup', function(req, res) {
  var account = req.body.account;
  var password = req.body.password;
  // mongodb
  mongoose.connect('mongodb://admin:admin@ds036079.mlab.com:36079/chatroom');
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', function() {
    // we're connected!
    var userSchema = mongoose.Schema({
      account: String,
      password: String
    });
    var user = mongoose.model('user', userSchema);


    user.findOne({ 'account': account}, 'account', function (err, user) {
      // if (err) return handleError(err);
      if(!user){
        var User = mongoose.model('user', userSchema);
        var user = new User({ account: account, password: password });

        user.save(function (err, user) {
          if (err) return console.error(err);
        })

        res.sendFile(path.join(__dirname + '/chatroom.html'));
      }
      else {
        res.send('Account already exists!');
      }
    })
  });
});


// error handler
// router.use(function(req, res, next) {
//   if (res.status === 404) {
//     res.status(404).send('Sorry cant find that');
//   } else {
//     next();
//   }
// });
//
// router.use(function(err, req, res, next) {
//   console.log(err.stack);
//   res.status(500).send('Something broke!');
// });

module.exports = router
