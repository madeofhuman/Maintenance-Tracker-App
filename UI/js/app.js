var signinBtn = document.getElementById('sign-in-btn');
var signinForm = document.getElementById('sign-in-form')

var signupBtn = document.getElementById('sign-up-btn');
var signupForm = document.getElementById('sign-up-form');

var loginLinks = document.getElementById('login-links');

var closeSigninFormBtn = document.getElementById('sign-in-form-close-btn');
var closeSignupFormBtn = document.getElementById('sign-up-form-close-btn');

signinBtn.addEventListener('click', ()=>{
	hide(loginLinks);
	unhide(signinForm)
})

signupBtn.addEventListener('click', ()=>{
	hide(loginLinks);
	unhide(signupForm);
})

closeSigninFormBtn.addEventListener('click', ()=>{
	hide(signinForm);
	unhide(loginLinks);
})

closeSignupFormBtn.addEventListener('click', ()=>{
	hide(signupForm);
	unhide(loginLinks);
})

function hide(element){
	element.classList.add('hidden');
}

function unhide(element){
	element.classList.remove('hidden');
}