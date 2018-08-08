var express = require('express'),
	router = express.Router({mergeParams: true}),
	Seed = require('../models/seed.js'),
	Comment = require('../models/comment.js'),
	faker = require('faker'),
	sanitizeHtml = require('sanitize-html');


// ****************
// Comment Route
// ****************

//CREATE ROUTE FOR COMMENT
router.post('/', function (req, res) {
	req.body.comment.text = sanitizeHtml(req.body.comment.text);
	var comment = {
		author: {
			id: req.user._id,
			username: req.user.username,
			avatar: req.user.avatar
		},
		text: req.body.comment.text
	};

	Seed.findById(req.params.id, function(err, foundSeed) {
		if (err) {
			console.log(err);
		} else {
			// Create a new comment
			Comment.create(comment, function(err, newComment) {
				if (err) {
					console.log(err);
				} else {
					// Add comment to Seed
					foundSeed.comments.push(newComment);
					// Save the comment
					foundSeed.save();
					res.redirect('/seeds/' + foundSeed._id);
				}
			});
		}
	});
});

module.exports = router;