var Seed = require('../models/seed'),
	Comment = require('../models/comment');

// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkSeedOwnership = function (req, res, next) {
	if (req.isAuthenticated()) {
		Seed.findById(req.params.id, function(err, foundSeed) {
			if (err) {
				console.log(err);
			} else {
				// does user own seed
				if (foundSeed.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		res.redirect("back");
	}
};

middlewareObj.checkFollowable = function (req, res, next) {
	if (req.isAuthenticated()) {
		Seed.findById(req.params.id, function(err, foundSeed) {
			if (err) {
				console.log(err);
			} else {
				// does user own seed
				if (foundSeed.author.id.equals(req.user._id)) {
					res.redirect("back");
				} else {
					next();
				}
			}
		});
	} else {
		res.redirect("back");
	}
};

// middlewareObj.checkCommentOwnership = function(req, res, next) {
// 	if (req.isAuthenticated()) {
// 		Comment.findById(req.params.comment_id, function(err, foundComment) {
// 			if (err) {
// 				console.log("back");
// 			} else {
// 				// does user own the comment?
// 				if (foundComment.author.id.equals(req.user._id)) {
// 					next();
// 				} else {
// 					// otherwise, redirect
// 					// req.flash("error", "You do not have permission to do that.");
// 					res.redirect("back");
// 				}
// 			}
// 		});	
// 	} else {
// 		// req.flash("error", "You need to be logged in.");
// 		res.redirect("back");
// 	}
// };

module.exports = middlewareObj;