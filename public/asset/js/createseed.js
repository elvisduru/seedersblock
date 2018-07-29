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

// Gather excerpt from content
$('#post-form').submit(function () {
	createExcerpt();

});

function createExcerpt() {
	
	$('#excerpt').val($('#editor').trumbowyg('html').substring($('#editor').trumbowyg('html').indexOf("<p>"), $('#editor').trumbowyg('html').indexOf("</p>")).replace(/<p>/g, "").replace(/<\/p>/g, "").replace(/<br>/g, ""));
}

// initialize materialized select
$(document).ready(function(){
	$('select').formSelect();
});

// initialize sidenav
$(document).ready(function(){
	$('.sidenav').sidenav();
});
