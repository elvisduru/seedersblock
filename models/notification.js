var mongoose = require('mongoose'),
	mongoosePaginate = require('mongoose-paginate');

var notificationSchema = new mongoose.Schema({
	sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	content: String,
	is_read: Boolean,
	type: String,
	path: String,
	created: {type: Date, default: Date.now}
});

notificationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Notification', notificationSchema);