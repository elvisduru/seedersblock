var express = require('express'),
	router = express.Router(),
	ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
	Seed = require('../models/seed'),
	User = require('../models/user'),
	Stream = require('../models/stream');

router.get('/', ensureLoggedIn('/'), function(req, res) {
	var entry = req.query.q;
	var results = {};
	Seed.find({$text: {$search: entry}}).limit(5).exec()
	.then(function(seeds) {
		results.seeds = seeds;
		return Stream.find({$text: {$search: entry}}).limit(5).exec();
	})
	.then(function(streams) {
		results.streams = streams;
		return User.find({$text: {$search: entry}}).limit(5).exec();
	})
	.then(function(users) {
		results.users = users;
		res.render('search/index', {results: results});
	})
	.catch(err => console.log(err));
})

router.get('/seeds', ensureLoggedIn('/'), function (req, res) {
	var entry = req.query.q;
	Seed.paginate({$text: {$search: entry}})
	.then(function(seeds) {
		res.render('search/seeds', {seeds: seeds});
	})
	.catch(function(err) {
		console.log(err);
	})
});

router.get('/users', ensureLoggedIn('/'), function(req, res) {
	var results = {};
	var entry = req.query.q;
	User.paginate({$text: {$search: entry}})
	.then(function(users) {
		res.render('search/users', {users: users});
	})
	.catch(function(err) {
		console.log(err);
	})
});

router.get('/streams', ensureLoggedIn('/'), function(req, res) {
	var results = {};
	var entry = req.query.q;
	Stream.paginate({$text: {$search: entry}})
	.then(function(streams) {
		res.render('search/streams', {streams: streams});
	})
	.catch(function(err) {
		console.log(err);
	})
});

module.exports = router;