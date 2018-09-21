var express = require('express'),
	router = express.Router({mergeParams: true}),
	Seed = require('../models/seed.js'),
	Notification = require('../models/notification'),
	Feeds = require("pusher-feeds-server"),
	Comment = require('../models/comment.js'),
	faker = require('faker'),
	sanitizeHtml = require('sanitize-html');

// Feeds Config
const feeds = new Feeds({
	instanceLocator: process.env.instanceLocator,
	key: process.env.key
});

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
					foundSeed.save(function(err) {
						if (err) {
							console.log(err);
						} else {
							var notification = {
								sender: req.user._id,
								receiver: foundSeed.author.id,
								content: "commented on your seed",
								type: "comment_seed",
								is_read: false,
								path: "/seeds/" + foundSeed._id
							}
							console.log();
							if (!(notification.receiver.equals(notification.sender))) {
								Notification.create(notification)
								.then(() => {
									var feed = {
										sender: req.user,
										receiver: foundSeed.author.id,
										text: "just commented on your seed",
										path: "/seeds/" + foundSeed._id,
										time: new Date()
									}
									feeds.publish("comment-seed", feed);
									res.redirect('back');
								})
								.catch(err => console.log(err));
							} else {
								res.redirect('back');
							}
						}
					});
				}
			});
		}
	});
});

module.exports = router;