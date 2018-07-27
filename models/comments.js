var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
	author: {
		avatar: String,
		username: String
	},
	text: String
});

module.exports = mongoose.model('Comment', commentSchema);