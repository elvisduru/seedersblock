function restrictMinus(e) {
    var inputKeyCode = e.keyCode ? e.keyCode : e.which;

    if (inputKeyCode != null) {
        if (inputKeyCode == 45) e.preventDefault();
    }
}

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
	$(this).text("sowing...");
	var that = this;
	var amt = $('.amount').val();
	var currentUserEarnings = $('.currentUserEarnings').text();
	if (amt < currentUserEarnings) {
		$.ajax({
			method: "PUT",
			url: url + 'sow',
			data: {amount: amt}
		}).done(function(data) {
			$('.seedEarnings').text(data.seedEarnings);
			$('.currentUserEarnings').text(data.userEarnings);
			$(that).text("sow");
		})
		.fail(function(err) {
			console.log("Couldn't sow: " + err);
		})
	} else {
		alert("You don't have enough GSD to do that!");
		$(that).text("sow");
	}
})

// sow button
$('.earning span').click(show);

$('.earning span').mouseenter(show);

$('.close').click(hide);

$('.sow').mouseleave(hide);

function show() {
	$('.sow').addClass('show');
    $('.sow').show();
}

function hide() {
	$('.sow').removeClass('show');
	$('.sow').hide();
}

$('.comment-form').submit(function(e) {
	if (!($('#new-comment').val())) {
		e.preventDefault();
		alert('No input');
	}        
});