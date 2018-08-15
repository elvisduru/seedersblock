var express = require('express'),
	router = express.Router({mergeParams: true}),
	Stream = require('../models/stream'),
	Comment = require('../models/comment'),
	sanitizeHtml = require('sanitize-html');


// ****************
// Stream Comment Route
// ****************

// create route for stream
router.post('/', function(req, res) {
	req.body.text = sanitizeHtml(req.body.text);
	var comment = {
		author: {
			id: req.user._id,
			username: req.user.username,
			avatar: req.user.avatar
		},
		text: req.body.text
	};

	Stream.findById(req.params.id, function(err, foundStream) {
		if (err) {
			console.log(err);
		} else {
			Comment.create(comment, function(err, newComment) {
				if (err) {
					console.log(err);
				} else {
					foundStream.comments.push(newComment);
					foundStream.save();
					res.json(newComment);
				}
			});
		}
	});
});

router.delete('/:comment_id', function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if (err) {
			console.log(err);
		} else {
			res.json({ok: true});
		}
	});
});

module.exports = router;