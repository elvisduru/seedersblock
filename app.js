var express 	= 	require('express'),
	mongoose 	= 	require('mongoose'),
	bodyParser 	= 	require('body-parser'),
	Seed      	= 	require('./models/seeds.js'),
	faker		=	require('faker'),
	multer		=	require('multer'),
	seedDB		=	require('./seed');

var app = express();

// create database
mongoose.connect("mongodb://localhost/seedersblock");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use('/scripts', express.static(__dirname + '/node_modules/trumbowyg/dist/'));

// Configure multer
var upload = multer({ storage: storage });

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, __dirname+'/public/file/uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now());
	}
});

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
	console.log(req.file);
	res.render("seeds/new");
});

// CREATE ROUTE
app.post('/seeds', upload.any(), function (req, res) {
	if (!req.files) {
    console.log("No file received");
    return res.send({
      success: false
    });

  } else {
    console.log('file received');
    return res.send({
      success: true
    })
  }
});

app.listen(3000, function () {
	console.log("Started Seedersblock app...");
});

