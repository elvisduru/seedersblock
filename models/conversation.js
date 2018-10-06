var mongoose = require('mongoose');

var conversationSchema = new mongoose.Schema({
	participants: [String]
});

module.exports = mongoose.model('Conversation', conversationSchema);