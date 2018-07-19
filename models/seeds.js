var mongoose = require('mongoose');

var seedSchema = new mongoose.Schema({
	author: String,
	title: String,
	image: String,
	created: {type: Date, default: Date.now},
	body: String,
	category: String,
	paid: {type: Boolean, default: false}
});

module.exports = mongoose.model('Seed', seedSchema);