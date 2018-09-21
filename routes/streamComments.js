var express = require('express'),
	router = express.Router({mergeParams: true}),
	Stream = require('../models/stream'),
	Comment = require('../models/comment'),
	Notification = require('../models/notification'),
	Feeds = require("pusher-feeds-server"),
	sanitizeHtml = require('sanitize-html');

// Feeds Config
const feeds = new Feeds({
	instanceLocator: process.env.instanceLocator,
	key: process.env.key
});

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
					var notification = {
						sender: req.user._id,
						receiver: foundStream.author.id,
						content: "commented on your post",
						type: "comment_stream",
						is_read: false,
						path: "/stream#" + foundStream._id
					}
					Notification.create(notification)
					.then(() => {
						var feed = {
							sender: req.user,
							receiver: foundStream.author.id,
							text: "commented on your post just now",
							path: "/stream#" + foundStream._id,
							streamId: foundStream._id,
							comment: req.body.text,
							time: new Date()
						}
						feeds.publish("comment-stream", feed);
						res.json(newComment);
					})
					.catch(err => console.log(err));
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