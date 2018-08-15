var express = require('express'),
	router = express.Router(),
	multer = require('multer'),
	Seed = require('../models/seed'),
	User = require('../models/user'),
	ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
	path = require('path'),
	faker = require('faker'),
	middleware = require('../middleware'),
	sanitizeHtml = require('sanitize-html');


// Configure multer
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../public/file/uploads/'));
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now());
	}
});

var upload = multer({
	storage: storage,
	fileFilter: function (req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
			return cb(new Error('Only image files are allowed!'));
		}
		cb(null, true);
	}
});

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
	var host = req.headers.host;
	var prefix = 'file/uploads/';

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
		category: req.body.seed.category,
		views: faker.random.number(),
		commentCount: faker.random.number(),
		earnings: faker.random.number()
	};

	if (!req.file) {
		console.log("No file received");
		return res.send({
			success: false
		});
	} else {
		console.log('file received');
		var filePath = req.protocol + "://" + host + '/' + prefix + req.file.filename;
		seed.image = filePath;
		Seed.create(seed, function (err, createdSeed) {
			if (err) {
				console.log(err);
			} else {
				return res.redirect('/seeds/' + createdSeed._id);
			}
		});
	}
});

// Show Route
router.get('/:id', ensureLoggedIn('/'), function (req, res) {
	Seed.findById(req.params.id).populate("comments").exec(function (err, foundSeed) {
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
			foundSeed.upvote(req.user._id, function (err, upvotedSeed) {
				if (err) {
					console.log(err);
				}
				upvotedSeed.upvoteCount = upvotedSeed.upvotes();
				upvotedSeed.save();
				res.json(upvotedSeed);
			});
		}
	});
});

router.put('/:id/downvote', function (req, res) {
	Seed.findById(req.params.id, function (err, foundSeed) {
		if (err) {
			console.log(err);
		} else {
			foundSeed.downvote(req.user._id, function (err, downvotedSeed) {
				if (err) {
					console.log(err);
				}
				downvotedSeed.downvoteCount = downvotedSeed.downvotes();
				downvotedSeed.save();
				res.json(downvotedSeed);
			});
		}
	});
});

module.exports = router;