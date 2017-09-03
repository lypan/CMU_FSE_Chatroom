var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
  account: String,
  password: String
});
var user = mongoose.model('users', userSchema);
module.exports = user;
