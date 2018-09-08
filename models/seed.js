var mongoose = require('mongoose'),
	mongoosePaginate = require('mongoose-paginate'),
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
	image: {type: String, default: "https://miro.medium.com/fit/c/1400/420/1*MQl0Eq-bP3AAfzOyblPahw.png"},
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

seedSchema.index({title: 'text', body: 'text'});
seedSchema.plugin(voting);
seedSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Seed', seedSchema);