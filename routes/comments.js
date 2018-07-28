var express = require('express'),
	router = express.Router({mergeParams: true}),
	Seed = require('../models/seed.js'),
	Comment = require('../models/comment.js'),
	faker = require('faker'),
	sanitizeHtml = require('sanitize-html');


// ****************
// Comment Route
// ****************

//NEW ROUTE FOR COMMENT 
router.get('/new', function (req, res) {
	Seed.findById(req.params.id, function (err, foundSeed) {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', {
				seed: foundSeed
			});
		}
	});

});

//CREATE ROUTE FOR COMMENT
router.post('/', function (req, res) {
	req.body.comment.text = sanitizeHtml(req.body.comment.text);
	var comment = {
		author: {
			username: faker.internet.userName(),
			avatar: faker.image.avatar()
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