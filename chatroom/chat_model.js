var mongoose = require('mongoose');
var chatSchema = mongoose.Schema({
  account: String,
  content: String,
  timestamp: Number
});
var chat = mongoose.model('chat', chatSchema);
module.exports = chat;
