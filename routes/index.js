var express = require('express'),
	router 	= express.Router(),
	passport = require('passport'),
	Seed	= require('../models/seed'),
	Profile = require('../models/profile'),
	User	= require('../models/user'),
	Comment	= require('../models/comment');

// Index route
router.get('/', function (req, res) {
	res.render("landing");
});

//Dasboard Route 
router.get('/settings',function (req, res){
	res.render("settings");
});

// User Profile route
router.get('/stream', function(req, res) {
	Seed.find({}).populate("comments").exec(function(err, seeds) {
		if (err) {
			console.log(err);
		} else {
			res.render("stream", {seeds: seeds});
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

		var newUser = {
			id: user._id,
			username: user.username
		};

		req.body.user.user = newUser;
		var newProfile = req.body.user;

		Profile.create(newProfile, function(err, createdProfile) {
			if (err) {
				console.log(err);
			} else {
				console.log(createdProfile);
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
	failureRedirect: '/login'
}), function(req, res) {
});

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect("/");
});

module.exports = router;