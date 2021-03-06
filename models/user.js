var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var passportLocalMongoose = require('passport-local-mongoose');
var tempAvatar = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	avatar: {type: String, default: tempAvatar},
	firstname: String,
	lastname: String,
	email: String,
	dateOfBirth: String,
	gender: String,
	country: String,
	state: String,
	language: String,
	occupation: String,
	following: [{
		type: mongoose.Schema.Types.ObjectId, ref: 'User'
	}],
	followers: [{
		type: mongoose.Schema.Types.ObjectId, ref: 'User'
	}],
	conversations: [{
		type: mongoose.Schema.Types.ObjectId, ref: 'Conversation'
	}],
	status: String,
	notifications: [{type: mongoose.Schema.Types.ObjectId, ref: 'Notification'}],
	earnings: {type: Number, default: 1000}
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', userSchema);