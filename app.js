require('dotenv').config();
var express = require('express'),
	app = express(),
	path = require('path'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	passport = require('passport'),
	LocalStrategy = require("passport-local"),
	Chatkit = require('@pusher/chatkit-server'),
	User = require('./models/user');

// create database
mongoose.connect("mongodb://elvisduru:buildthefuture123@ds123372.mlab.com:23372/seeders", { autoIndex: false })
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
	res.locals.currentUser = req.user;
	next();
});

// add req.query as local variable
app.use(function(req, res, next) {
	res.locals.query = req.query;
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

// const chatkit = new Chatkit.default({
// 	instanceLocator: process.env.chatInstanceLocator,
// 	key: process.env.chatKey,
// })

// chatkit.createUser({
// 	id: req.user._id,
// 	name: req.user.username,
// 	avatarURL: req.user.avatar
// })
// .then(() => {
// 	console.log("user created successfully")
// }).catch(err => console.log(err));

// chatKit.createRoom({
// 	creatorId: req.user._id,
// 	name: "Chat-room"
// })
// .then(() => console.log("Room created successfully"))
// .catch(err => console.log(err));

const PORT = process.env.PORT || 3000
app.listen(PORT, function () {
	console.log("Started Seedersblock app...");
});