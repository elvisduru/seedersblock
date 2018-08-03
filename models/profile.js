var mongoose = require('mongoose');

var profileSchema = new mongoose.Schema({
	user: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String,
		avatar: String,
	},
	firstName: String,
	lastName: String,
	email: String,
	dateOfBirth: String,
	gender: String,
	country: String,
	state: String,
	language: String,
	occupation: String
});

module.exports = mongoose.model('Profile', profileSchema);