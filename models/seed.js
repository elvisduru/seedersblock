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
	views: {type: Number, default: 0},
	commentCount: {type: Number, default: 0},
	upvoteCount: Number,
	downvoteCount: Number,
	earnings: {type: Number, default: 0},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	]
});

seedSchema.plugin(voting);

module.exports = mongoose.model('Seed', seedSchema);