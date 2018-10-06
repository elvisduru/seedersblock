require('dotenv').config();
var express = require('express'),
	app = express(),
	server = require('http').Server(app),
	io = require('socket.io')(server),
	path = require('path'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	passport = require('passport'),
	LocalStrategy = require("passport-local"),
	Conversation = require('./models/conversation'),
	Feeds = require("pusher-feeds-server"),
	Notification = require('./models/notification'),
	Message = require('./models/message');
	User = require('./models/user'),
	users = {};

// create database
mongoose.connect("mongodb://elvisduru:buildthefuture123@ds123753.mlab.com:23753/seedersblock", { autoIndex: false })
.catch(function() {
	console.log("Could not connect to database");
});
mongoose.Promise = Promise;

// Configure Routes
var seedRoutes = require("./routes/seeds");
var streamRoutes = require("./routes/stream");
var commentRoutes = require("./routes/comments");
var streamCommentRoutes = require("./routes/streamComments");
var searchRoutes = require("./routes/search");
var indexRoutes = require("./routes/index");

// configure session middleware
app.use(require('express-session')({
	secret: "Express is really cool",
	resave: false,
	saveUninitialized: false
}));

// configure passport
app.use(passport.initialize());
app.use(passport.session());

// configure strategy
passport.use(new LocalStrategy(User.authenticate()));

// serialize and deserialize user during session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/trumbowyg', express.static(path.join(__dirname, '/node_modules/trumbowyg/')));
app.use('/jquery-resizable-dom', express.static(path.join(__dirname, '/node_modules/jquery-resizable-dom/')));

// add req.path as local variable
app.use(function(req, res, next) {
	res.locals.path = req.path;
	res.locals.query = req.query;
	res.locals.currentUser = req.user;
	next();
});

// prevent favicon redirect
app.use( function(req, res, next) {
  if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
    return res.sendStatus(204);
  }
  return next();
});

// Set EJS as default view engine
app.set("view engine", "ejs");

// seedDB();

// requiring routes
app.use("/search", searchRoutes);
app.use("/seeds", seedRoutes);
app.use("/stream", streamRoutes);
app.use("/seeds/:id/comments", commentRoutes);
app.use("/stream/:id/comments", streamCommentRoutes);
app.use("/", indexRoutes);

const feeds = new Feeds({
	instanceLocator: process.env.instanceLocator,
	key: process.env.key
});

io.on("connection", function(socket) {
	socket.on("new-user", function(data) {
		socket.username = data;
		users[socket.username] = socket;
		updateOnlineUsers();
	})
	
	socket.on("send-message", function(data) {
		var msg = data.msg.trim();
		var recipient = data.recipient;
		var sender = data.sender;
		var conversationId = data.conversationId;
		User.findOne({username: sender}, function(err, currentUser) {
			if (err) {
				console.log(err);
			} else {
				User.findOne({username: recipient}, function(err, foundUser) {
					if (err) {
						console.log(err);
					} else {
						Message.create({
							sender: currentUser._id,
							content: msg,
							created: Date.now(),
							conversationId: conversationId
						}, function(err, createdMsg) {
							if (err) {
								console.log(err)
							} else {
								var notification = {
									sender: currentUser._id,
									receiver: foundUser._id,
									content: 'sent you a message',
									type: "message",
									path: '/messenger?friend=' + currentUser.username,
									is_read: false
								}
								Notification.create(notification)
								.then(() => {
									var feed = {
										sender: currentUser,
										receiver: foundUser._id,
										text: "messaged you just now",
										path: '/messenger?friend=' + currentUser.username,
										time: new Date()
									}
									feeds.publish("message", feed);
									if (recipient in users) {
										users[recipient].emit('new-message', {msg: msg, username: socket.username, firstname: currentUser.firstname, lastname: currentUser.lastname, conversationId: conversationId});
									} else {
										console.log("user offline");
									}
								})
								.catch(err => console.log(err));
							}
						})
					}
				});
			}
		})
	});

	socket.on('disconnect', function(data) {
		if (!socket.username) return;
		delete users[socket.username];
		updateOnlineUsers();
	})
})

function updateOnlineUsers() {
	io.emit('userIds', Object.keys(users));
}

const PORT = process.env.PORT || 3000
server.listen(PORT, function () {
	console.log("Started Seedersblock app...");
});