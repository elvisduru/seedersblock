var express = require('express'),
	router 	= express.Router(),
	Seed	= require('../models/seed'),
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

module.exports = router;