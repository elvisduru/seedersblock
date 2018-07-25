var	mongoose 	= 	require('mongoose'),
	faker		=	require('faker'),
	Seed 		= 	require('./models/seeds.js');

// var data = [];

// function NewSeed() {
// 	this.author = {
// 		avatar: faker.image.avatar(),
// 		username: faker.internet.userName() 
// 	},
// 	this.title = faker.lorem.sentence(),
// 	this.image = "https://source.unsplash.com/1600x900/",
// 	this.body = faker.lorem.paragraphs(),
// 	this.category = faker.random.words(),
// 	this.views = faker.random.number(),
// 	this.commentCount = faker.random.number(),
// 	this.upvoteCount = faker.random.number(),
// 	this.downvoteCount = faker.random.number(),
// 	this.earnings = faker.random.number();
// }

// for (var i = 0; i < 6; i++)
// 	data.push(new NewSeed());

function seedDB() {
	// Remove Existing Seeds
	Seed.remove({}, function(err) {
		if (err) {
			console.log(err);
		}

		console.log("Removed Seeds");

		// // Create new seeds
		// data.forEach(function(item) {
		// 	Seed.create(item, function(err, createdSeed) {
		// 		if (err) {
		// 			console.log(err); 
		// 		}
		// 		else {
		// 			console.log("created seed");
		// 		}
		// 	});
		// });
	});
}

module.exports = seedDB;

