var	mongoose 	= 	require('mongoose'),
	faker		=	require('faker'),
	Seed 		= 	require('./models/seed.js'),
	Comment 	= 	require('./models/comment.js');

var data = [];

function NewSeed() {
	this.author = {
		avatar: faker.image.avatar(),
		username: faker.internet.userName() 
	},
	this.title = faker.lorem.sentence(),
	this.image = "https://source.unsplash.com/1600x900/",
	this.body = faker.lorem.paragraphs(),
	this.category = faker.random.words(),
	this.views = faker.random.number(),
	this.commentCount = faker.random.number(),
	this.upvoteCount = faker.random.number(),
	this.downvoteCount = faker.random.number(),
	this.earnings = faker.random.number();
	this.excerpt = faker.lorem.paragraphs();
}

function NewComment() {
	this.author = {
		avatar: faker.image.avatar(),
		username: faker.internet.userName()
	},
	this.text = faker.lorem.sentence();
}

for (var i = 0; i < 2; i++)
	data.push(new NewSeed());

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
					console.log("created seed");
					// Create a new comment
					Comment.create(new NewComment(), function(err, newComment) {
						if (err) {
							console.log(err);
						} else {
							// Add comment to Seed
							createdSeed.comments.push(newComment);
							// Save the comment
							createdSeed.save();
							console.log(createdSeed);
						}
					});
					
					
				}
			});
		});
	});
}



module.exports = seedDB;

