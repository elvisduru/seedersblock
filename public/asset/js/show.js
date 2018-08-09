$('.dropdown-trigger').dropdown();

var url = $('span.url').text();

updateScore();

$('#upvote').click(function() {
	$.ajax({
		method: "PUT",
		url: url + 'upvote'
	}).done(updateScore)
	.fail(function(err) {
		console.log("Couldn't upvote: " + err);
	});
	$(this).addClass('voted');
	$('#downvote').removeClass('voted');
});

$('#downvote').click(function() {
	$.ajax({
		method: "PUT",
		url: url + 'downvote'
	}).done(updateScore)
	.fail(function(err) {
		console.log("Couldn't downvote: " + err);
	});
	$(this).addClass('voted');
	$('#upvote').removeClass('voted');
});

function updateScore() {
	$.ajax({
		method: "GET",
		url: url + 'votes'
	}).done(function(data) {
		$('#voteCount').text(data);
	}).fail(function(err) {
		console.log(err);
	});
}