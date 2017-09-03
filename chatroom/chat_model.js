var mongoose = require('mongoose');
var chatSchema = mongoose.Schema({
  account: String,
  content: String,
  time: Number
});
var chat = mongoose.model('chat', chatSchema);
module.exports = chat;
