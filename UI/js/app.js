var signinLink = document.getElementById('sign-in-link');
var signinForm = document.getElementById('sign-in-form')

var signupLink = document.getElementById('sign-up-link');
var signupForm = document.getElementById('sign-up-form');

var loginLinks = document.getElementById('login-links');

var closeSigninFormBtn = document.getElementById('sign-in-form-close-btn');
var closeSignupFormBtn = document.getElementById('sign-up-form-close-btn');

var signinBtn = document.getElementById('signin-btn');
var signupBtn = document.getElementById('signup-btn');

var newRequestButton = document.getElementById('new-request-btn');

if(signinLink){
	signinLink.addEventListener('click', ()=>{
		hide(loginLinks);
		unhide(signinForm)
	})
}

if(signupLink){
	signupLink.addEventListener('click', ()=>{
		hide(loginLinks);
		unhide(signupForm);
	})
}

if(closeSigninFormBtn){
	closeSigninFormBtn.addEventListener('click', ()=>{
		hide(signinForm);
		unhide(loginLinks);
	})
}

if(closeSignupFormBtn){
	closeSignupFormBtn.addEventListener('click', ()=>{
		hide(signupForm);
		unhide(loginLinks);
	})
}

function hide(element){
	element.classList.add('hidden');
}

function unhide(element){
	element.classList.remove('hidden');
}

function redirectTo(url){
	window.location.replace(url);
}

// Imitate login post method url redirect

if(signinBtn){
	signinBtn.addEventListener('click', ()=>{
		hide(signinForm);
		redirectTo('UI/user/dashboard.html');
	});
}

if(signupBtn){
	signupBtn.addEventListener('click', ()=>{
		hide(signinForm);
		redirectTo('UI/user/dashboard.html');
	});
}

// Imitate request creation post method url redirect

if(newRequestButton){
	newRequestButton.addEventListener('click', ()=>{
		redirectTo('dashboard.html');
	});
}