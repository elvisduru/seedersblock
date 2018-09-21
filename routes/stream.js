var express = require('express'),
	router = express.Router(),
	Stream = require('../models/stream'),
	User = require('../models/user'),
	Notification = require('../models/notification'),
	Feeds = require("pusher-feeds-server"),
	middleware = require('../middleware'),
	ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
	sanitizeHtml = require('sanitize-html');

// Feeds Config
const feeds = new Feeds({
	instanceLocator: process.env.instanceLocator,
	key: process.env.key
});

// ****************
// Stream Route
// ****************

// User Profile route
router.get('/', ensureLoggedIn('/'), function(req, res) {
	Stream.find({$or:[{'author.username': req.user.username}, {'author.id': {$in: req.user.following}}]}).sort({created: -1}).populate('comments').exec(function(err, streams) {
		if (err) {
			res.send(err);
		} else {
			res.render("stream", {streams: streams});
		}
	});
});

router.post('/', ensureLoggedIn('/'), function(req, res) {
	req.body.stream = sanitizeHtml(req.body.stream, {
		allowedTags: ['h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
			'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
			'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe', 'img', 'br', 'hr', 'audio', 'video'
		],
		allowedAttributes: false,
		allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com']
	});
	var stream = {
		author: {
			id: req.user._id,
			username: req.user.username,
			avatar: req.user.avatar
		},
		body: req.body.stream
	};
	Stream.create(stream, function(err, createdStream) {
		if (err) {
			res.send(err);
		} else {
			res.redirect('back');
		}
	});
});

// Delete Route
router.delete('/:id/delete', middleware.checkStreamOwnership, function(req, res) {
	Stream.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			res.send(err);
		} else {
			res.redirect('back');
		}
	});
});

router.put('/:id/sow', function(req, res) {
	Stream.findById(req.params.id, function(err, foundStream) {
		if (err) {
			res.send(err);
		} else {
			req.body.amount = Number(req.body.amount);
			req.user.earnings -= req.body.amount;
			foundStream.earnings += req.body.amount;
			User.findOneAndUpdate({username: foundStream.author.username}, { $inc: { earnings: +req.body.amount } }, {new: true }, function(err, user) {
					if (err) {
						res.send(err);
					}
				})
			foundStream.save();
			req.user.save();
			res.json({seedEarnings: foundStream.earnings, userEarnings: req.user.earnings});
		}
	})
});

router.post('/:id/like', function(req, res) {
	Stream.findById(req.params.id, function(err, foundStream) {
		if (err) {
			res.send(err);
		} else {
			var isInArray = foundStream.likes.some(function (user) {
			    return user.equals(req.user._id);
			});
			if (!isInArray) {
				foundStream.likes.push(req.user._id);
				foundStream.save();
				var notification = {
					sender: req.user._id,
					receiver: foundStream.author.id,
					content: "liked your post",
					type: "like_stream",
					is_read: false,
					path: "/stream#" + foundStream._id
				}
				Notification.create(notification)
				.then(() => {
					var feed = {
						sender: req.user,
						receiver: foundStream.author.id,
						text: "liked your post just now",
						path: "/stream#" + foundStream._id,
						time: new Date()
					}
					feeds.publish("like-stream", feed);
					res.json({message: "success"});
				})
				.catch(err => console.log(err));
			} else {
				res.json({message: "already liked by you"});
			}
		}
	})
});

router.post('/:id/unlike', function(req, res) {
	Stream.findById(req.params.id, function(err, foundStream) {
		if (err) {
			res.send(err);
		} else {
			foundStream.likes.remove(req.user._id);
			foundStream.save();
			res.json({message: "unliked"});
		}
	})
})

module.exports = router;