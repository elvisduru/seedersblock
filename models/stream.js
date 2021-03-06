var mongoose = require('mongoose'),
	mongoosePaginate = require('mongoose-paginate'),
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
	earnings: {type: Number, default: 0},
	downvoteCount: Number,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	],
	likes: [{
		type: mongoose.Schema.Types.ObjectId, ref: 'User'
	}]
});

streamSchema.index({body: 'text'});
streamSchema.plugin(voting);
streamSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Stream', streamSchema);