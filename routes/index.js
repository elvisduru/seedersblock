var express = require('express'),
	router 	= express.Router(),
	passport = require('passport'),
	path = require('path'),
	sanitizeHtml = require('sanitize-html'),
	ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
	multer  = require('multer'),
	cloudinary = require('cloudinary'),
	cloudinaryStorage = require('multer-storage-cloudinary'),
	Seed	= require('../models/seed'),
	User	= require('../models/user'),
	Comment	= require('../models/comment');


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


// Index route
router.get('/', function (req, res) {
	res.render("landing");
});

//Dasboard Route 
router.get('/settings', ensureLoggedIn('/'), function (req, res){
	res.render("settings");
});

router.post('/settings', upload.single('avatar'), function(req, res) {
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
	
	if (req.file) {
		newProfile.avatar = req.file.secure_url;
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