function formatStr(str) {
	if (str.length > 3) {
		str = str.substring(0, 3) + "k";
		return str;
	} else {
		return str;
	}
}

$(".card-action span > span").each(function(i) {
	$(this).text(formatStr($(this).text()));
});