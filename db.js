var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin@ds036079.mlab.com:36079/chatroom');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  var userSchema = mongoose.Schema({
      name: String
  });
  var user = mongoose.model('user', userSchema);

  var user1 = new user({ name: 'Jason' });
  var user2 = new user({ name: 'David' });


  user1.save(function (err, user1) {
    if (err) return console.error(err);
  })

  user2.save(function (err, user2) {
    if (err) return console.error(err);
  })

  // user.findOne({ 'name': 'Jason' }, 'name', function (err, user) {
  //   if (err) return handleError(err);
  //   console.log('%s.', user.name);
  // })

});
