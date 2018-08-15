var express = require('express'),
	app = express(),
	path = require('path'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	passport = require('passport'),
	LocalStrategy = require("passport-local"),
	User = require('./models/user'),
	seedDB = require('./seed');

// create database
mongoose.connect("mongodb://elvisduru:buildthefuture123@ds123372.mlab.com:23372/seeders");

// Configure Routes
var seedRoutes = require("./routes/seeds");
var streamRoutes = require("./routes/stream");
var commentRoutes = require("./routes/comments");
var streamCommentRoutes = require("./routes/streamComments");
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

// Set EJS as default view engine
app.set("view engine", "ejs");

// seedDB();

// requiring routes
app.use("/seeds", seedRoutes);
app.use("/stream", streamRoutes);
app.use("/seeds/:id/comments", commentRoutes);
app.use("/stream/:id/comments", streamCommentRoutes);
app.use("/", indexRoutes);

const PORT = process.env.PORT || 3000
app.listen(PORT, function () {
	console.log("Started Seedersblock app...");
});