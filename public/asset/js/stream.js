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

$('#editor').trumbowyg({
	btnsDef: {
		// Create a new dropdown
		image: {
			dropdown: ['insertImage', 'upload'],
			ico: 'insertImage'
		}
	},
	btns: [
		['viewHTML'],
		['undo', 'redo'], // Only supported in Blink browsers
		['formatting'],
		['strong', 'em', 'del'],
		['foreColor', 'backColor'],
		['superscript', 'subscript'],
		['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
		['unorderedList', 'orderedList'],
		['horizontalRule'],
		['table'],
		['removeformat'],
		['link'],
		['image', 'insertAudio'],
		['fullscreen']
	],
	plugins: {
		// Add imagur parameters to upload plugin for demo purposes
		upload: {
			serverPath: 'https://api.imgur.com/3/image',
			fileFieldName: 'image',
			urlPropertyName: 'data.link',
			headers: {
				'Authorization': 'Client-ID 82ba68ef5d815bb'
			}
		}
	},
	autogrow: true,
	autogrowOnEnter: true,
	imageWidthModalEdit: true,
	urlProtocol: true,
});

$(document).ready(function(){
	$('.sidenav').sidenav();
});

$('.dropdown-trigger').dropdown();

var id;

$('.comment-input').keypress(function (e) {
	if (e.which == 13) {
		id = e.target.id;
		var value = e.target.value;
		if (value) {
			$.ajax({
				method: "POST",
				url: '/stream/' + id + '/comments',
				data: {text: value}
			}).done(function (data) {
				var currentDate = new Date();
				$('#comments_' + id).append('<div id="comment_' + data._id + '"><div class="right remove-comment"><button id="' + data._id + '" class="btn-floating btn-small waves-effect waves-light light-teal comment-delete"><i class="material-icons">delete</i></button></div><div class="valign-wrapper"><div class="user-avatar"><img src="'+ data.author.avatar + '" alt="" class="circle responsive-img"></div><div class="comment-meta"><span class="black-text">' + data.author.username + '</span><br><span class="grey-text">' + currentDate.toLocaleTimeString() + '</span></div></div><p>' + data.text + '</p></div>'
				);
				$('.comment-input').val("");
				var commentCount = Number($('.commentCount-' + id).text()) + 1;
				$('.commentCount-' + id).text(commentCount);
			}).fail(function(err) {
				console.log(err);
			});
		}
	}
});

var commentId;

$(document).on('click', '.comment-delete', function() {
	var elem = $(this);
	commentId = elem.attr('id');
	
	deleteComment();
});

function deleteComment() {
	$('#comment_' + commentId).fadeOut(function() {
		$.ajax({
			method: "DELETE",
			url: '/stream/:id/comments/' + commentId,
		}).done(function() {
			console.log("deleted comment");
		}).fail(function(err) {
			console.log(err);
		});
	});
}

$('.comment-button a').click(function() { 
	$(this).closest('.card-panel').find('.comment-input').focus();
})

// sowing logic
$('.earning .sow div button').click(function(e) {
	id = e.target.id;
	var amt = $(this).siblings('input').val();
	$(this).text("sowing...");
	var that = this;
	$.ajax({
		method: "PUT",
		url: '/stream/' + id + '/sow',
		data: {amount: amt}
	}).done(function(data) {
		$('.seedEarnings-' + id).text(data.seedEarnings);
		$('.currentUserEarnings').text(data.userEarnings);
		$(that).text("sow");
	})
	.fail(function(err) {
		console.log("Couldn't sow: " + err);
	})
})

$('.like-button button').click(function(e) {
	id = e.target.id;
	var postUrl = '/stream/' + id + '/like';
	$.post(postUrl)
	.done(function(data) {
		if(data.message === "success") {
			likeStream(id);
		} else {
			unlikeStream(id);
		}
	})
	.fail(function(err) {
		console.log(`unsuccessfull ${err}`);
	})
})

function likeStream(id) {
	$('button#' + id).addClass('voted');
	var likeCount = Number($('.likeCount-' + id).text()) + 1;
	$('.likeCount-' + id).text(likeCount);
	console.log("like successful");
}

function unlikeStream(id) {
	var postUrl = '/stream/' + id + '/unlike';
	$.post(postUrl)
	.done(function(data) {
		$('button#' + id).removeClass('voted');
		var likeCount = Number($('.likeCount-' + id).text()) - 1;
		$('.likeCount-' + id).text(likeCount);
		console.log("unlike successful");
	})
	.fail(function(err) {
		console.log(`unsuccessfull ${err}`);
	})
}

// sow button
$('.amt').click(show);

$('.amt').mouseenter(show);

$('.close').click(hide);

$('.sow').mouseleave(function() {
	$(this).removeClass('show');
	$(this).hide();
});

function show() {
	$(this).children('.sow').addClass('show');
    $(this).children('.sow').show();
}

function hide(e) {
	e.stopPropagation();
	$(this).parent().removeClass('show');
	$(this).parent().hide();
}

$('.content-form').submit(function(e) {
	if (!($('.trumbowyg-editor').text())) {
		e.preventDefault();
		console.log('No input');
	}        
});