var express 	= 	require('express'),
	mongoose 	= 	require('mongoose'),
	bodyParser 	= 	require('body-parser'),
	Seed      	= 	require('./models/seeds.js'),
	faker		=	require('faker'),
	seedDB		=	require('./seed');

var app = express();

// create database
mongoose.connect("mongodb://localhost/seedersblock");

// app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use('/scripts', express.static(__dirname + '/node_modules/trumbowyg/dist/'));

// Set EJS as default view engine
app.set("view engine", "ejs");

seedDB();

// Landing page route
app.get('/', function (req, res) {
	res.render("landing");
});


// ****************
// Seed Route
// ****************

// Index Route
app.get('/seeds', function (req, res) {
	Seed.find({}, function (err, seeds) {
		if (err) {
			console.log(err);
		} else {
			res.render("seeds/index", {
				seeds: seeds
			});
		}
	});

});

//NEW ROUTE
app.get('/seeds/new', function (req, res) {
	res.render("seeds/new");
});

// // CREATE ROUTE
// app.get('/seeds/edit', function (req, res) {
// 	res.render("seeds/edit");
// });

app.listen(3000, function () {
	console.log("Started Seedersblock app...");
});

