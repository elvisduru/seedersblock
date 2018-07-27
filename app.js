var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	Seed = require('./models/seeds.js'),
	faker = require('faker'),
	multer = require('multer'),
	sanitizeHtml = require('sanitize-html'),
	methodOverride = require('method-override'),
	seedDB		=	require('./seed');

var app = express();

// create database
mongoose.connect("mongodb://localhost/seedersblock");

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use('/trumbowyg', express.static(__dirname + '/node_modules/trumbowyg/'));
app.use('/jquery-resizable-dom', express.static(__dirname + '/node_modules/jquery-resizable-dom/'));

// Configure multer
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, __dirname + '/public/file/uploads/');
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

// Set EJS as default view engine
app.set("view engine", "ejs");

// seedDB();

// Landing page route
app.get('/', function (req, res) {
	res.render("landing");
});


// ****************
// Seed Route
// ****************

// Index Route
app.get('/seeds', function (req, res) {
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
app.get('/seeds/new', function (req, res) {
	res.render("seeds/new");
});

// CREATE ROUTE
app.post('/seeds', upload.single('featuredImg'), function (req, res) {
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

	var body = req.body.seed;

	var seed = {
		author: {
			username: faker.internet.userName(),
			avatar: faker.image.avatar()
		},
		title: req.body.seed.title,
		body: req.body.seed.content,
		excerpt: req.body.seed.excerpt,
		category: req.body.seed.category,
		views: faker.random.number(),
		commentCount: faker.random.number(),
		upvoteCount: faker.random.number(),
		downvoteCount: faker.random.number(),
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
app.get('/seeds/:id', function (req, res) {
	Seed.findById(req.params.id, function (err, foundSeed) {
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
app.delete('/seeds/:id/delete', function(req, res) {
	Seed.findByIdAndRemove(req.params.id, function(err, removedSeed) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/seeds');
		}
	});
});

// Edit Route
app.get('/seeds/:id/edit', function(req, res) {
	Seed.findById(req.params.id, function(err, foundSeed) {
		if (err) {
			console.log(err);
		} else {
			res.render('seeds/edit', {seed: foundSeed});
		}
	});
});


app.put('/seeds/:id', function(req, res) {
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

	var body = req.body.seed;

	var seed = {
		title: req.body.seed.title,
		body: req.body.seed.content,
		excerpt: req.body.seed.excerpt
	};

	Seed.findByIdAndUpdate(req.params.id, seed, function(err, updatedSeed) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/seeds/' + updatedSeed._id);
		}
	});
});

app.listen(3000, function () {
	console.log("Started Seedersblock app...");
});