var express = require('express'),
	router = express.Router();

// Index route
router.get('/', function (req, res) {
	res.render("landing");
});

module.exports = router;