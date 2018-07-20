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
	category: String,
	paid: {type: Boolean, default: false},
	views: Number,
	commentCount: Number,
	upvoteCount: Number,
	downvoteCount: Number,
	earnings: Number
});

module.exports = mongoose.model('Seed', seedSchema);