var mongoose = require('mongoose');

var conversationSchema = new mongoose.Schema({
	participants: [String],
	lastUpdated: {type: Date, default: Date.now},
	connected: {type: Boolean, default: false}
});

module.exports = mongoose.model('Conversation', conversationSchema);