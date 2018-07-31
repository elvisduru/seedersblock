var express = require('express'),
	router = express.Router();

// Index route
router.get('/', function (req, res) {
	res.render("landing");
});

//Dasboard Route 
router.get('/settings',function (req, res){
	res.render("settings");
});

module.exports = router;