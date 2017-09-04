var express = require('express')
var app = express()
var session = require('express-session')
var path = require('path');
var http = require('http').Server(app);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var database = ["Jason", "David"];
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());


app.use(session({
  secret: "Account",
  resave: false,
  saveUninitialized: true,
}))

// mongoose Schema
var User = require('./user_model.js');
var Chat = require('./chat_model.js');

app.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
});


app.get('/', function(req, res, next) {
  // req.session.destroy();
  if (req.session) {
    console.log(req.session);
    if (req.session.account) res.redirect('/chatroom');
    else res.redirect('/login');
  }
  else res.redirect('/login');
});

app.get('/login', function(req, res, next) {
  console.log('login get');
  res.render('login', {
    title: 'login'
  });
});

app.post('/login', function(req, res, next) {
  console.log('login post');
  console.log(req.body);
  var account = req.body.account;
  var password = req.body.password;

  if (account && password) {
    mongoose.connect('mongodb://admin:admin@ds036577.mlab.com:36577/user',
      {
      useMongoClient: true,
      }
    );
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      // we're connected!
      User.findOne({ 'account': account, 'password': password }, 'account password', function (err, user) {
        db.close();
        if(user){
          req.session.account = account;
          res.redirect('/chatroom');
        }
        else {
          // res.redirect('/signup');
          res.render('login', {
            title: 'login',
            error: 'Account or Password are wrong!'
          });
        }
      })
    });
  }
});

app.get('/chatroom', function(req, res, next) {
  console.log('get chatroom');
  res.render('chatroom', {
    title: 'chatroom',
    account: req.session.account
  });
});


app.get('/signup', function(req, res, next) {
  res.render('signup', {
    title: 'signup',
    error: ''
  });
})

app.post('/signup', function(req, res, next) {
  var account = req.body.account;
  var password = req.body.password;
  // mongodb
  mongoose.connect('mongodb://admin:admin@ds036577.mlab.com:36577/user',
    {
    useMongoClient: true,
    }
  );
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  console.log('connection to user');
  db.once('open', function() {
    // we're connected!
    User.findOne({ 'account': account}, 'account', function (err, user) {
      if(!user){
        var user = new User({ account: account, password: password });

        user.save(function (err, user) {
          if (err) return console.error(err);
          db.close();
        });

        req.session.account = account;
        res.redirect('/chatroom');
      }
      else {
        res.render('signup', {
          title: 'signup',
          error: 'Account is already exists!'
        });
      }
    });
  });
});


io.on('connection', function(socket) {
  console.log('a user connected');

  mongoose.connect('mongodb://admin:admin@ds036079.mlab.com:36079/chat',
    {
    useMongoClient: true,
    }
  );
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));

  Chat.find({}, 'account content timestamp', function(err, msgs){
      if(err){
        console.log(err);
      } else{
          // console.log(msgs);
      }

      if(msgs.length != 0) {
        for(var i = 0; i < msgs.length; i ++) {
          console.log(msgs[i]);
          socket.emit('chat message', msgs[i]);
        }
      }

      socket.on('chat message', function(msg){
        console.log(msg);
        // mongodb
        var chat = new Chat({ account: msg.account, content: msg.content, timestamp: msg.timestamp });
        chat.save(function (err, chat) {
          if (err) return console.error(err);
        });
        io.emit('chat message', msg);
      });
  });

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
})

http.listen(3000, function() {
  console.log('listening on port 3000!')
})
