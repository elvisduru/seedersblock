var express = require('express'),
	router 	= express.Router(),
	passport = require('passport'),
	path = require('path'),
	sanitizeHtml = require('sanitize-html'),
	ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
	multer  = require('multer'),
	cloudinary = require('cloudinary'),
	cloudinaryStorage = require('multer-storage-cloudinary'),
	Feeds = require("pusher-feeds-server"),
	Seed	= require('../models/seed'),
	Stream = require('../models/stream'),
	User	= require('../models/user'),
	Notification = require('../models/notification'),
	Chatkit = require('@pusher/chatkit-server'),
	Conversation = require('../models/conversation'),
	Message = require('../models/message'),
	Comment	= require('../models/comment');


const feeds = new Feeds({
	instanceLocator: process.env.instanceLocator,
	key: process.env.key
});

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

// get logged in user data
router.get('/user', ensureLoggedIn('/'), function(req, res) {
	User.findById(req.user._id).populate("conversations").exec()
	.then(function(user) {
		res.status(200).json(user);
	})
	.catch(function(err) {
		console.log(err);
	})
})

// get a user
router.get('/anyuser', ensureLoggedIn('/'), function(req, res) {
	User.findOne({username: req.query.username})
	.then(function(user) {
		res.status(200).json(user);
	})
	.catch(function(err) {
		console.log(err);
	})
})

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
			res.redirect('/seeds');
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
					res.redirect('/settings');
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

router.get('/notifications', function(req, res) {
	Notification.paginate({receiver: req.user._id}, {sort: {created: -1}, limit: 5, populate: "sender"})
	.then(notifications => res.status(200).json(notifications))
	.catch(err => console.log(err));
})

// read notification
router.put('/notification/:id', function(req, res) {
	Notification.findByIdAndUpdate(req.params.id, {is_read: true})
	.then(() => res.json({message: "successful"}))
	.catch(err => console.log(err));
})

router.post('/follow-user', function(req, res) {
	User.findOne({ username: req.body.username }, function(err, user) {
		user.followers.push(req.user._id);
		var notification = {
			sender: req.user._id,
			receiver: user._id,
			content: "followed you",
			type: "follow",
			path: req.user.username,
			is_read: false
		}
		Notification.create(notification)
		.then(() => console.log("notification created"))
		.catch(err => console.log(err));
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
							var feed = {
								user: user,
								text: "just followed you",
								path: "/" + req.user.username,
								time: new Date(),
							}
							feeds.publish("follow", feed);	
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
			res.render('users/following', {users: foundUser.following});
		}
	});
});

router.get('/followers', ensureLoggedIn('/'), function(req, res) {
	User.findById(req.user._id).populate("followers").exec(function(err, foundUser) {
		if (err) {
			console.log(err);
		} else {
			res.render('users/followers', {users: foundUser.followers});
		}
	});
});

router.get('/messenger', ensureLoggedIn('/'), function(req, res) {
	if (req.query.friend) {
		User.findById(req.user._id).populate('conversations').exec(function(err, foundUser) {
			if (err) {
				console.log(err);
			} else {
				foundUser.conversations.forEach(conversation => {
					if (conversation.participants.includes(req.query.friend)) {
						Message.find({conversationId: conversation._id}, function(err, foundMessages) {
							var msgData = {
								chatwith: conversation.participants[1];
								messages: foundMessages;
							}
							res.render('messenger', msgData);
						})
					}
				})
			}
		})
	} else {
		res.render('messenger');
	}
});

router.post('/start-conversation', ensureLoggedIn('/'), function(req, res) {
	var participants = req.body.participants;
	console.log(participants[0]);
	var newConversation = {
		participants,
	}

	User.findById(req.user._id).populate("conversations").exec(function(err, foundUser) {
		if (err) {
			console.log(err);
		} else {
			var conversation;
			console.log(foundUser.conversations);
			var hasConversation = false;
			foundUser.conversations.forEach(conversation => {
				if (conversation.participants.includes(participants[0])) {
					hasConversation = true;
					console.log("already conversing");
					res.status(200).json(conversation);
				}
			})
			if (hasConversation == false) {
				Conversation.create(newConversation, function(err, createdConversation) {
					if (err) {
						console.log(err);
					} else {
						req.user.conversations.push(createdConversation._id);
						req.user.save();
						res.status(200).json(createdConversation);
						console.log("new conversation");
					}
				});
			}
		}
	});
	
})

router.post('/sendMessage', function(req, res) {
	var newMessage = {
		sender: req.user._id,
		content: req.body.msg.content
	}
	User.findById(req.body.userId, function(err, foundUser) {
		if (err) {
			console.log(err);
		} else {
				
		}
	})
})

router.post('/fetchMessages', function(req, res) {
	Conversation.find()
})

router.get('/friends', ensureLoggedIn('/'), function(req, res) {
	User.findById(req.user._id).populate('following').populate('followers').exec(function(err, foundUser) {
		if (err) {
			console.log(err);
		} else {
			var friends = foundUser.following.concat(foundUser.followers);
			friends = friends.filter((friend, index, arr) => {
				return arr.map(mapObj => mapObj["username"]).indexOf(friend["username"]) === index;
			});
			res.status(200).json(friends);
		}
	});
});

// User Show Route
router.get('/:username', ensureLoggedIn('/'), function(req, res) {
	Stream.find({$or:[{'author.username': req.params.username}, {'author.id': {$in: req.user.following}}]}).sort({created: -1}).populate('comments').exec(function(err, streams) {
		if (err) {
			console.log(err);
		} else {
			User.findOne({ username: req.params.username }, function(err, foundUser) {
				if (err) {
					console.log(err);
				} else {
					if (!foundUser) {
						res.send("<h3>No user found with that username</h3>");
					} else {
						var obj = {};
						obj.returnedUser = foundUser;
						obj.streams = streams;
						res.render("stream_user", {obj: obj});
					}
				}
			});
		}
	});
});


router.get('/:username/seeds', ensureLoggedIn('/'), function(req, res) {
	Seed.find({ 'author.username': req.params.username }, function(err, seeds) {
		if (err) {
			console.log(err);
		} else {
			res.render('seed_user', {seeds: seeds});
		}
	})
})

module.exports = router;