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
		$.ajax({
			method: "POST",
			url: '/stream/' + id + '/comments',
			data: {text: value}
		}).done(function (data) {
			var currentDate = new Date();
			$('#comments_' + id).append('<div id="comment_' + data._id + '"><div class="right remove-comment"><button id="' + data._id + '" class="btn-floating btn-small waves-effect waves-light light-teal comment-delete"><i class="material-icons">delete</i></button></div><div class="valign-wrapper"><div class="user-avatar"><img src="'+ data.author.avatar + '" alt="" class="circle responsive-img"></div><div class="comment-meta"><span class="black-text">' + data.author.username + '</span><br><span class="grey-text">' + currentDate.toLocaleTimeString() + '</span></div></div><p>' + data.text + '</p></div>'
			);
			$('.comment-input').val("");
		}).fail(function(err) {
			console.log(err);
		});
	}
});

var commentId;

$(document).on('click', '.comment-delete', function() {
	var elem = $(this);
	commentId = elem.attr('id');
	console.log($('#comments_' + commentId));
	
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