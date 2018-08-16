var express = require('express'),
	router = express.Router(),
	Stream = require('../models/stream'),
	User = require('../models/user'),
	middleware = require('../middleware'),
	ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
	sanitizeHtml = require('sanitize-html');

// ****************
// Stream Route
// ****************

// User Profile route
router.get('/', ensureLoggedIn('/'), function(req, res) {
	Stream.find({$or:[{'author.username': req.user.username}, {'author.id': {$in: req.user.following}}]}).sort({created: -1}).populate('comments').exec(function(err, streams) {
		if (err) {
			console.log(err);
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
			console.log(err);
		} else {
			res.redirect('back');
		}
	});
});

// Delete Route
router.delete('/:id/delete', middleware.checkStreamOwnership, function(req, res) {
	Stream.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('back');
		}
	});
});

module.exports = router;