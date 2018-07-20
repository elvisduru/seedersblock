var	mongoose 	= 	require('mongoose'),
	faker		=	require('faker'),
	Seed 		= 	require('./models/seeds.js');

var data = [];

function SeedData() {
	author = {
		avatar: faker.image.avatar(),
		username: faker.internet.userName() 
	},
	title = faker.lorem.sentence(),
	image = faker.random.image(),
	body = faker.lorem.paragraphs(),
	category = faker.random.words(),
	views = faker.random.number(),
	commentCount = faker.random.number(),
	upvoteCount = faker.random.number(),
	downvoteCount = faker.random.number(),
	earnings = faker.random.number();
};


for (var i = 0; i < 10; i++)
	data.push(new SeedData());

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

