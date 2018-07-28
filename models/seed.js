var mongoose = require('mongoose');

var seedSchema = new mongoose.Schema({
	author: {
		avatar: String,
		username: String 
	},
	title: String,
	image: String,
	created: {type: Date, default: Date.now},
	body: String,
	category: [String],
	excerpt: String,
	paid: {type: Boolean, default: false},
	views: Number,
	commentCount: Number,
	upvoteCount: Number,
	downvoteCount: Number,
	earnings: Number,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	]
});

module.exports = mongoose.model('Seed', seedSchema);