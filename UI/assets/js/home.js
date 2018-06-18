/* eslint no-undef: 0 */

/* Page elements */

const loginLink = document.getElementById('sign-in-link');
const loginFormContainer = document.getElementById('sign-in-form');
const signupLink = document.getElementById('sign-up-link');
const signupFormContainer = document.getElementById('sign-up-form');
const loginLinks = document.getElementById('login-links');
const closeLoginFormBtn = document.getElementById('sign-in-form-close-btn');
const closeSignupFormBtn = document.getElementById('sign-up-form-close-btn');
const signupForm = document.getElementById('signup-form');
const output = document.getElementsByClassName('output');
const confirmPassword = document.getElementById('password-confirm');
const loginForm = document.getElementById('login-form');

/* Hide and show forms */

loginLink.addEventListener('click', () => {
  hide(loginLinks);
  unhide(loginFormContainer);
});

signupLink.addEventListener('click', () => {
  hide(loginLinks);
  unhide(signupFormContainer);
});

closeLoginFormBtn.addEventListener('click', () => {
  hide(loginFormContainer);
  unhide(loginLinks);
});

closeSignupFormBtn.addEventListener('click', () => {
  hide(signupFormContainer);
  unhide(loginLinks);
});


/* Sign up */

/**
* Signs up a user
* @param { Form } form - the form element
*/
const signUp = (form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = getFormData(event);
    const { password } = formData;
    if (password !== confirmPassword.value) {
      output[1].innerHTML = 'the passwords you entered don\'t match';
      return;
    }
    const method = 'POST';
    const apiPath = '/api/v1/auth/signup';
    const headers = {
      'Content-Type': 'application/json',
    };
    submitForm(formData, apiPath, method, headers, event, '');
  });
};

signUp(signupForm);


/* Log in */

/**
* Logs in a user
* @param { Form } form - the form element
* @param { String } apiPath - the api path called
* @param { String } method - the http method
*/
const login = (form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = getFormData(event);
    const apiPath = 'api/v1/auth/login';
    fetch(apiPath, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then(response => response.json())
      .then((result) => {
        displayFetchMessage(result, event);
        setToken(result);
        redirectOnLogin(result);
      })
      .catch((error) => {
        console.log(error.stack);
      });
  });
};

login(loginForm);
