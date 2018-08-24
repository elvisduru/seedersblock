$('.dropdown-trigger').dropdown();

$(document).ready(function(){
	$('.sidenav').sidenav();
});

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

// sowing logic
$('.earning .sow div button').click(function() {
	var amt = $('.amount').val();
	$.ajax({
		method: "PUT",
		url: url + 'sow',
		data: {amount: amt}
	}).done(function(data) {
		$('.seedEarnings').text(data.seedEarnings);
		$('.currentUserEarnings').text(data.userEarnings);
	})
	.fail(function(err) {
		console.log("Couldn't sow: " + err);
	})
})

// sow button
$('.earning span').click(function() {
    $('.sow').addClass('show');
    $('.sow').show();
})

$('.earning span').mouseenter(function() {
    $('.sow').addClass('show');
    $('.sow').show();
})

$('.close').click(function() {
	$('.sow').removeClass('show');
	$('.sow').hide();
})