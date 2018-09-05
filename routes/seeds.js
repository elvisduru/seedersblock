var express = require('express'),
	router = express.Router(),
	multer = require('multer'),
	Seed = require('../models/seed'),
	User = require('../models/user'),
	ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
	path = require('path'),
	cloudinary = require('cloudinary'),
	cloudinaryStorage = require('multer-storage-cloudinary'),
	faker = require('faker'),
	middleware = require('../middleware'),
	sanitizeHtml = require('sanitize-html');


// config cloudinary
cloudinary.config({ 
  cloud_name: 'techspark', 
  api_key: '498576454111458', 
  api_secret: 'MKfoudAN2D_1k9ZYcOBqwq9iu10' 
});



// Configure multer
var storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'uploads',
  allowedFormats: ['jpg', 'png'],
  filename: function (req, file, cb) {
    cb(undefined, 'image');
  }
});

var upload = multer({storage: storage});

// ****************
// Seed Route
// ****************

// Index Route
router.get('/', ensureLoggedIn('/'), function (req, res) {
	Seed.find({}, function (err, seeds) {
		if (err) {
			console.log(err);
		} else {
			res.render("seeds/index", {
				seeds: seeds
			});
		}
	});

});

//NEW ROUTE
router.get('/new', ensureLoggedIn('/'), function (req, res) {
	console.log(req.path);
	res.render("seeds/new");
});

// CREATE ROUTE
router.post('/', upload.single('featuredImg'), function (req, res) {
	res.set('X-XSS-Protection', 0);
	
	// xss validation
	req.body.seed.title = sanitizeHtml(req.body.seed.title);
	req.body.seed.content = sanitizeHtml(req.body.seed.content, {
		allowedTags: ['h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
			'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
			'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe', 'img', 'br', 'hr', 'audio', 'video'
		],
		allowedAttributes: false,
		allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com']
	});
	req.body.seed.excerpt = sanitizeHtml(req.body.seed.excerpt);

	var seed = {
		author: {
			id: req.user._id,
			username: req.user.username,
			avatar: req.user.avatar
		},
		title: req.body.seed.title,
		body: req.body.seed.content,
		excerpt: req.body.seed.excerpt,
		category: req.body.seed.category
	};

	if (!req.file) {
		console.log("No file received");
	} else {
		console.log('file received');
		seed.image = req.file.secure_url;
	}
	Seed.create(seed, function (err, createdSeed) {
		if (err) {
			console.log(err);
		} else {
			return res.redirect('/seeds/' + createdSeed._id);
		}
	});
});

// Show Route
router.get('/:id', ensureLoggedIn('/'), function (req, res) {
	Seed.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, {new: true }).populate("comments").exec(function (err, foundSeed) {
		if (err) {
			console.log(err);
		} else {
			res.render('seeds/show', {
				seed: foundSeed
			});
		}
	});
});

// Delete Route
router.delete('/:id/delete', middleware.checkSeedOwnership, function (req, res) {
	Seed.findByIdAndRemove(req.params.id, function (err, removedSeed) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/seeds');
		}
	});
});

// Edit Route
router.get('/:id/edit', middleware.checkSeedOwnership, function (req, res) {
	Seed.findById(req.params.id, function (err, foundSeed) {
		if (err) {
			console.log(err);
		} else {
			res.render('seeds/edit', {
				seed: foundSeed
			});
		}
	});
});


router.put('/:id', middleware.checkSeedOwnership, function (req, res) {
	res.set('X-XSS-Protection', 0);

	// xss validation
	req.body.seed.title = sanitizeHtml(req.body.seed.title);
	req.body.seed.content = sanitizeHtml(req.body.seed.content, {
		allowedTags: ['h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
			'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
			'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe', 'img', 'br', 'hr', 'audio', 'video'
		],
		allowedAttributes: false,
		allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com']
	});
	req.body.seed.excerpt = sanitizeHtml(req.body.seed.excerpt);

	var seed = {
		title: req.body.seed.title,
		body: req.body.seed.content,
		excerpt: req.body.seed.excerpt
	};

	Seed.findByIdAndUpdate(req.params.id, seed, function (err, updatedSeed) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/seeds/' + updatedSeed._id);
		}
	});
});

router.get('/:id/votes', function (req, res) {
	Seed.findById(req.params.id, function (err, foundSeed) {
		if (err) {
			console.log(err);
		} else {
			var score = foundSeed.upvotes() - foundSeed.downvotes();
			res.json(score);
		}
	});
});

router.put('/:id/upvote', function (req, res) {
	Seed.findById(req.params.id, function (err, foundSeed) {
		if (err) {
			console.log(err);
		} else {
			var isInArray = foundSeed.vote.positive.some(function (vote) {
			    return vote.equals(req.user._id);
			});
			if (!isInArray) {
				foundSeed.upvote(req.user._id, function (err, upvotedSeed) {
					if (err) {
						console.log(err);
					} else {
						if (upvotedSeed.upvotes() && upvotedSeed.upvotes() % 5 === 0) {
							upvotedSeed.earnings += 10;
							User.findOneAndUpdate({username: upvotedSeed.author.username}, { $inc: { earnings: 10 } }, {new: true }, function(err, user) {
								if (err) {
									console.log(err);
								}
							});
						}
						upvotedSeed.upvoteCount = upvotedSeed.upvotes();
						upvotedSeed.save();
						res.json(upvotedSeed);
					}
				});
			} 
		}
	});
});

router.put('/:id/downvote', function (req, res) {
	Seed.findById(req.params.id, function (err, foundSeed) {
		if (err) {
			console.log(err);
		} else {
			var isInArray = foundSeed.vote.negative.some(function (vote) {
			    return vote.equals(req.user._id);
			});
			if (!isInArray) {
				foundSeed.downvote(req.user._id, function (err, downvotedSeed) {
					if (err) {
						console.log(err);
					} else {
						if (downvotedSeed.downvotes() && downvotedSeed.downvotes() % 5 === 0) {
							downvotedSeed.earnings -= 5;
							User.findOneAndUpdate({username: downvotedSeed.author.username}, { $inc: { earnings: -5 } }, {new: true }, function(err, user) {
								if (err) {
									console.log(err);
								}
							});
						}
						downvotedSeed.downvoteCount = downvotedSeed.downvotes();
						downvotedSeed.save();
						res.json(downvotedSeed);
					}
				});
			}
			
		}
	});
});

router.put('/:id/sow', function(req, res) {
	Seed.findById(req.params.id, function(err, foundSeed) {
		if (err) {
			console.log(err);
		} else {
			req.body.amount = Number(req.body.amount);
			req.user.earnings -= req.body.amount;
			foundSeed.earnings += req.body.amount;
			User.findOneAndUpdate({username: foundSeed.author.username}, { $inc: { earnings: +req.body.amount } }, {new: true }, function(err, user) {
					if (err) {
						console.log(err);
					}
				})
			foundSeed.save();
			req.user.save();
			res.json({seedEarnings: foundSeed.earnings, userEarnings: req.user.earnings});
		}
	})
})

module.exports = router;