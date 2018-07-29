function formatStr(str) {
	str = str.trim();
	if (str.length > 3) {
		str = str.substring(0, 3) + "k";
		return str;
	} else {
		return str;
	}
}

$(".formatcount").each(function(i) {
	$(this).text(formatStr($(this).text()));
});

$('.sidenav').removeClass("sidenav-fixed");