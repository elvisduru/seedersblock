var express = require('express'),
	router 	= express.Router(),
	passport = require('passport'),
	path = require('path'),
	sanitizeHtml = require('sanitize-html'),
	ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
	multer  = require('multer'),
	Seed	= require('../models/seed'),
	User	= require('../models/user'),
	Comment	= require('../models/comment');

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


// Index route
router.get('/', function (req, res) {
	res.render("landing");
});

//Dasboard Route 
router.get('/settings', ensureLoggedIn('/'), function (req, res){
	res.render("settings");
});

router.post('/settings', upload.single('avatar'), function(req, res) {
	var host = req.headers.host;
	var prefix = 'file/uploads/';

	// xss validation
	req.body.status = sanitizeHtml(req.body.status);
	req.body.state = sanitizeHtml(req.body.state);
	req.body.occupation = sanitizeHtml(req.body.occupation);

	var newProfile = {
		state: req.body.state,
		occupation: req.body.occupation,
		status: req.body.status,
		dateOfBirth: req.body.dateOfBirth,
	};
	
	var filePath = req.protocol + "://" + host + '/' + prefix + req.file.filename;
	if (req.file) {
		console.log('file received');
		newProfile.avatar = filePath;
	}
	User.findByIdAndUpdate(req.user._id, newProfile, function(err, updatedProfile) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/settings');
		}
	});

});

router.post('/register', function(req, res) {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			console.log(err);
			return res.redirect('back');
		}

		User.findByIdAndUpdate(user._id, req.body.user, function(err, updatedUser) {
			if (err) {
				console.log(err);
			} else {
				// log user in
				passport.authenticate("local")(req, res, function() {
					res.redirect('/seeds');
				});
			}
		});
	});
});

router.post('/login', passport.authenticate('local', {
	successReturnToOrRedirect: '/seeds',
	failureRedirect: '/'
}), function(req, res) {
});

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect("/");
});

router.post('/follow-user', function(req, res) {
	User.findOne({ username: req.body.username }, function(err, user) {
		user.followers.push(req.user._id);
		var followedUser = user._id;
		user.save(function (err) {
			if (err) {
				console.log(err);
			} else {
				User.findOne({ username: req.user.username }, function(err, user) {
					user.following.push(followedUser);
					user.save(function(err) {
						if (err) {
							console.log(err);
						} else {
							console.log("User successfully followed");
							res.redirect('back');
						}
					});
				});
			}
		});
	});
});

router.post('/unfollow-user', function(req, res) {
	User.findOne({ username: req.body.username }, function(err, user) {
		user.followers.remove(req.user._id);
		var followedUser = user._id;
		user.save(function (err) {
			if (err) {
				console.log(err);
			} else {
				User.findOne({ username: req.user.username }, function(err, user) {
					user.following.remove(followedUser);
					user.save(function(err) {
						if (err) {
							console.log(err);
						} else {
							console.log("User successfully unfollowed");
							res.redirect('back');
						}
					});
				});
			}
		});
	});
});

router.get('/following', ensureLoggedIn('/'), function(req, res) {
	User.findById(req.user._id).populate("following").exec(function(err, foundUser) {
		if (err) {
			console.log(err);
		} else {
			res.render('users/index', {users: foundUser.following});
		}
	});
});

module.exports = router;