/* Page elements */

const signinLink = document.getElementById('sign-in-link');
const signinForm = document.getElementById('sign-in-form');
const signupLink = document.getElementById('sign-up-link');
const signupForm = document.getElementById('sign-up-form');
const loginLinks = document.getElementById('login-links');
const closeSigninFormBtn = document.getElementById('sign-in-form-close-btn');
const closeSignupFormBtn = document.getElementById('sign-up-form-close-btn');
const signupform = document.getElementById('signup-form');
const output = document.getElementsByClassName('output');
const confirmPassword = document.getElementById('password-confirm');
const loginForm = document.getElementById('login-form');

/* Interactive functions */

signinLink.addEventListener('click', () => {
  hide(loginLinks);
  unhide(signinForm);
});

signupLink.addEventListener('click', () => {
  hide(loginLinks);
  unhide(signupForm);
});

closeSigninFormBtn.addEventListener('click', () => {
  hide(signinForm);
  unhide(loginLinks);
});

closeSignupFormBtn.addEventListener('click', () => {
  hide(signupForm);
  unhide(loginLinks);
});


/* Sign up */

/**
* Signs up a user
* @param { String } form - the form element
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
    submitForm(formData, apiPath, method);
  });
};

signUp(signupform);


/* Log in */

/**
* Submits a form to an endpoint with a specified http method
* @param { String } form - the form element
* @param { String } apiPath - the api path called
* @param { String } method - the http methos
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
        if (result.statusCode !== 200) {
          const bracket = result.message.match(/\[(.*?)\]/);
          if (bracket) {
            output[0].innerHTML = bracket[1].toLowerCase();
            return;
          }
          output[0].innerHTML = result.message.toLowerCase();
          return;
        }
        output[0].innerHTML = result.message.toLowerCase();
        setToken(result);
        redirectOnLogin(result);
      })
      .catch((error) => {
        output[0].innerHTML = error.stack;
      });
  });
};

login(loginForm);
