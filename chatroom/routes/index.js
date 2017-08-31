var express = require('express');
var session = require('express-session')
var router = express.Router();
var database = ['Jason', 'David'];


router.use(session({
  secret: 'Account',
  resave: false,
  saveUninitialized: true,
}))


/* GET home page. */
router.get('/', function(req, res, next) {
  // req.session.destroy();
  if(req.session) {
    console.log(req.session);
    if(req.session.account)res.redirect('/chatroom');
    else res.redirect('/login');
  }
  else res.redirect('/login');

  // req.session.destroy();
  // if(req.session)console.log(req.session);
  // if (req.session) res.redirect('/chatroom');
  // else res.redirect('/login');

  // res.render('index', {
  //   title: 'Express'
  // });
  // var account = "Jason";
  // res.render('chatroom', {
  //   title: 'chatroom',
  //   account: account
  // });
});

router.get('/login', function(req, res, next) {
  console.log('login get');
  res.render('login', {
    title: 'login'
  });
});

router.post('/login', function(req, res, next) {
  console.log('login post');
  console.log(req.body);
  if (req.body.account && req.body.password) {
    // dummy database authentication
    var queryResult = database.find((account) => {
      return account == req.body.account;
    });

    if(queryResult) {
      console.log('find!');
      req.session.account = req.body.account;
      res.redirect('/chatroom');
    }
    else {
      console.log('not find');
    }
  }

});


router.get('/chatroom', function(req, res, next) {
  console.log('chatroom');
  res.render('chatroom', {
    title: 'chatroom',
    account: req.session.account
  });
});



router.post('/login', function(req, res, next) {
  var account = req.body.account;

});

module.exports = router;
