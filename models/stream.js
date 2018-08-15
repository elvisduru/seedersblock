var mongoose = require('mongoose'),
	voting	 = require('mongoose-voting');

var streamSchema = new mongoose.Schema({
	author: {
		id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
		avatar: String,
		username: String
	},
	created: { type: Date, default: Date.now },
	body: String,
	commentCount: Number,
	upvoteCount: Number,
	downvoteCount: Number,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	]
});

streamSchema.plugin(voting);

module.exports = mongoose.model('Stream', streamSchema);