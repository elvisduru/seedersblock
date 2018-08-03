$("#loginForm").validate({
	submitHandler: function (form) {
		form.submit();
	}
});

$("#registerForm").validate({
	submitHandler: function (form) {
		form.submit();
	}
});

$().ready(function () {
	// validate login form
	$("#loginForm").validate({
		rules: {
			username: {
				required: true,
				minlength: 2
			},
			password: {
				required: true,
				minlength: 5
			}
		},
		username: {
			required: "Please enter a username",
			minlength: "Your username must consist of at least 2 characters"
		},
		password: {
			required: "Please provide a password",
			minlength: "Your password must be at least 5 characters long"
		}
	});

	// validate signup form on keyup and submit
	$("#signupForm").validate({
		rules: {
			"user[firstname]": "required",
			"user[lastname]": "required",
			"user[username]": {
				required: true,
				minlength: 2
			},
			password: {
				required: true,
				minlength: 5
			},
			confirm_password: {
				required: true,
				minlength: 5,
				equalTo: "#password"
			},
			"user[email]": {
				required: true,
				email: true
			},
			agree: "required"
		},
		messages: {
			"user[firstname]": "Please enter your firstname",
			"user[lastname]": "Please enter your lastname",
			"user[username]": {
				required: "Please enter a username",
				minlength: "Your username must consist of at least 2 characters"
			},
			password: {
				required: "Please provide a password",
				minlength: "Your password must be at least 5 characters long"
			},
			confirm_password: {
				required: "Please provide a password",
				minlength: "Your password must be at least 5 characters long",
				equalTo: "Please enter the same password as above"
			},
			"user[email]": "Please enter a valid email address",
			agree: "Please accept our policy"
		}
	});

	$(window).keydown(function (event) {
		if (event.keyCode == 13) {
			event.preventDefault();
			return false;
		}
	});

	$('.step-one .button').on("click", function () {
		if ($("#signupForm").valid()) {
			$(this).parent().fadeOut(function () {
				$('.step-two').fadeIn();
			});
		}
	});

	$('.step-two .button').on("click", function () {
		$("#signupForm").valid();
	});

	$('#loginForm .button').on("click", function () {
		$("#loginForm").valid();
	});
});

$('.nav-register').on("click", showRegisterForm);

$('.nav-login').on("click", showLoginForm);

$('.hero-text .button').on("click", showRegisterForm);

function showRegisterForm() {
	$('.modal-register').fadeIn();
}

function showLoginForm() {
	$('.modal-login').fadeIn();
}

$(document).click(function (e) {
	if ($(e.target).is('.modal')) {
		$('.modal').hide();
	}
});


// testimonial widget config
var testimonials = [],
	leads = [],
	avatars = [];

function pushTestimonials() {
	$('.text').each(function () {
		testimonials.push($(this).text());
	});
	$('.lead').each(function () {
		leads.push($(this).text());
	});
	$('.avatar').each(function () {
		avatars.push($(this).attr("src"));
	});
}

function nextMsg() {
	if (testimonials.length === 0) {
		pushTestimonials();
	}
	$("[src='" + avatars.pop() + "']").animate({
		width: 100
	}, 1000).animate({
		width: 80
	}, 1000);
	$(".viewer-text").text(testimonials.pop()).fadeIn(500).delay(2000).fadeOut(500);
	$(".viewer-lead").text(leads.pop()).fadeIn(500).delay(2000).fadeOut(500, nextMsg);
}

nextMsg();


// posts config
var counter = 0;

$(".control-left").on("click", function () {

	if (counter !== 600) {
		$(".post").animate({
			left: "-=300px"
		});
		counter += 300;
		console.log(counter);
	}

});

$(".control-right").on("click", function () {
	if (counter !== 0) {
		$(".post").animate({
			left: "+=300px"
		});
		counter -= 300;
		console.log(counter);
	}
})

