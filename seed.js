var	mongoose 	= 	require('mongoose'),
	Seed 		= 	require('./models/seeds.js');

var data = [
	{
		author: "John Doe",
		title: "How to win a match",
		image: "https://images.unsplash.com/uploads/141103282695035fa1380/95cdfeef?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=cf56dd62f7e28facff79eaf6e7a78df4&auto=format&fit=crop&w=500&q=60",
		body: "some awesome post"		
	},
	{
		author: "Susan Doe",
		title: "How to lose a match",
		image: "https://images.unsplash.com/uploads/141103282695035fa1380/95cdfeef?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=cf56dd62f7e28facff79eaf6e7a78df4&auto=format&fit=crop&w=500&q=60",
		body: "some awesome post"		
	},
	{
		author: "Jackie Doe",
		title: "How to win a match",
		image: "https://images.unsplash.com/uploads/141103282695035fa1380/95cdfeef?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=cf56dd62f7e28facff79eaf6e7a78df4&auto=format&fit=crop&w=500&q=60",
		body: "some awesome post"		
	}
];

function seedDB() {
	// Remove Existing Seeds
	Seed.remove({}, function(err) {
		if (err) {
			console.log(err);
		}

		console.log("Removed Seeds");

		// Create new seeds
		data.forEach(function(item) {
			Seed.create(item, function(err, createdSeed) {
				if (err) {
					console.log(err);
				}
				else {
					console.log(createdSeed);
				}
			});
		});
	});
}

module.exports = seedDB;

