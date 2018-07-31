var express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	multer = require('multer'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	seedDB = require('./seed');

// Configure Routes
var seedRoutes = require("./routes/seeds");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");

// create database
mongoose.connect("mongodb://localhost/seedersblock");

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static(__dirname + "/public"));
app.use('/trumbowyg', express.static(__dirname + '/node_modules/trumbowyg/'));
app.use('/jquery-resizable-dom', express.static(__dirname + '/node_modules/jquery-resizable-dom/'));

// add req.path as local variable
app.use(function(req, res, next) {
	res.locals.path = req.path;
	next();
});

// Set EJS as default view engine
app.set("view engine", "ejs");

// seedDB();

// requiring routes
app.use("/seeds", seedRoutes);
app.use("/seeds/:id/comments", commentRoutes);
app.use("/", indexRoutes);

app.listen(3000, function () {
	console.log("Started Seedersblock app...");
});