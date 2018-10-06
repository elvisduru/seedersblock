var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	content: String,
	created: {type: Date, default: Date.now},
	conversationId: {
		type: Number,
		ref: 'Conversation'
	}
})

module.exports = mongoose.model('Message', messageSchema);