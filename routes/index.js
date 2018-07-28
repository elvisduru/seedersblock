var express = require('express'),
	router = express.Router();

// Index route
router.get('/', function (req, res) {
	res.render("landing");
});

//Dasboard Route 
router.get('/dashboard',function (req, res){
	res.render("dashboard");
});

module.exports = router;