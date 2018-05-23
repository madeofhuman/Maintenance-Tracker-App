const signinLink = document.getElementById('sign-in-link');
const signinForm = document.getElementById('sign-in-form')

const signupLink = document.getElementById('sign-up-link');
const signupForm = document.getElementById('sign-up-form');

const loginLinks = document.getElementById('login-links');

const closeSigninFormBtn = document.getElementById('sign-in-form-close-btn');
const closeSignupFormBtn = document.getElementById('sign-up-form-close-btn');

const signinBtn = document.getElementById('signin-btn');
const signupBtn = document.getElementById('signup-btn');

const newRequestButton = document.getElementById('new-request-btn');

if (signinLink) {
	signinLink.addEventListener('click', ()=> {
		hide(loginLinks);
		unhide(signinForm)
	})
}

if (signupLink) {
	signupLink.addEventListener('click', ()=> {
		hide(loginLinks);
		unhide(signupForm);
	})
}

if (closeSigninFormBtn) {
	closeSigninFormBtn.addEventListener('click', ()=> {
		hide(signinForm);
		unhide(loginLinks);
	})
}

if (closeSignupFormBtn) {
	closeSignupFormBtn.addEventListener('click', ()=> {
		hide(signupForm);
		unhide(loginLinks);
	})
}

function hide(element) {
	element.classList.add('hidden');
}

function unhide(element) {
	element.classList.remove('hidden');
}

function redirectTo(url) {
	window.location.replace(url);
}

// Imitate login post method url redirect

if (signinBtn) {
	signinBtn.addEventListener('click', ()=>{
		hide(signinForm);
		redirectTo('UI/user/dashboard.html');
	});
}

if (signupBtn) {
	signupBtn.addEventListener('click', ()=>{
		hide(signinForm);
		redirectTo('UI/user/dashboard.html');
	});
}

// Imitate request creation post method url redirect

if (newRequestButton) {
	newRequestButton.addEventListener('click', ()=>{
		redirectTo('dashboard.html');
	});
}