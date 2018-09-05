// get all number fields
var numInputs = document.querySelectorAll('input[type="number"]');

// Loop through the collection and call addListener on each element
Array.prototype.forEach.call(numInputs, addListener); 


function addListener(elm,index){
  elm.setAttribute('min', 1);  // set the min attribute on each field
  
  elm.addEventListener('keypress', function(e){  // add listener to each field 
     var key = !isNaN(e.charCode) ? e.charCode : e.keyCode;
     str = String.fromCharCode(key); 
    if (str.localeCompare('-') === 0){
       event.preventDefault();
    }
    
  });
  
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
		$('.earning .sow div button').text("sow");
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