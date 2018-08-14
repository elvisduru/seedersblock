var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var tempAvatar = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	avatar: {type: String, default: tempAvatar},
	firstName: String,
	lastName: String,
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
	status: String,
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);