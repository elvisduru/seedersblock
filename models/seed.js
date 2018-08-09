var mongoose = require('mongoose'),
	voting = require('mongoose-voting');

var seedSchema = new mongoose.Schema({
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
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

seedSchema.plugin(voting);

module.exports = mongoose.model('Seed', seedSchema);