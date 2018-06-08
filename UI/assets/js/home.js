
/* Page elements */

const signinLink = document.getElementById('sign-in-link');
const signinForm = document.getElementById('sign-in-form');
const signupLink = document.getElementById('sign-up-link');
const signupForm = document.getElementById('sign-up-form');
const loginLinks = document.getElementById('login-links');
const closeSigninFormBtn = document.getElementById('sign-in-form-close-btn');
const closeSignupFormBtn = document.getElementById('sign-up-form-close-btn');

/* Interactive functions */

const hide = (element) => {
  element.classList.add('hidden');
};

const unhide = (element) => {
  element.classList.remove('hidden');
};

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

const signupform = document.getElementById('signup-form');
const output = document.getElementsByClassName('output');
const confirmPassword = document.getElementById('password-confirm');

// https://medium.com/@trekinbami/explanation-of-javascripts-reduce-with-a-real-world-use-case-f3f5014951e2
const getFormData = (event) => {
  const elementArray = [...event.currentTarget.querySelectorAll('*[name]')];
  const formData = elementArray.reduce((prev, next) => {
    const inputName = next.getAttribute('name');
    const inputValue = next.value;
    prev[inputName] = inputValue;
    return prev;
  }, {});
  return formData;
};


/**
* Submits a form to an endpoint with a specified http method
* @param { String } form - the form element
* @param { String } apiPath - the api path called
* @param { String } method - the http methos
*/
const signUp = (form, apiPath, method) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = getFormData(event);
    const {
      password,
    } = formData;
    if (password !== confirmPassword.value) {
      output[1].innerHTML = 'the passwords you entered don\'t match';
      return;
    }
    fetch(apiPath, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then(response => response.json())
      .then((result) => {
        if (result.statusCode !== 201) {
          const bracket = result.message.match(/\[(.*?)\]/);
          if (bracket) {
            output[1].innerHTML = bracket[1].toLowerCase();
            return;
          }
          output[1].innerHTML = result.message;
          return;
        }
        output[1].innerHTML = 'account creation successful, please sign in';
      })
      .catch((error) => {
        output[1].innerHTML = error;
      });
  });
};

signUp(signupform, '/api/v1/auth/signup', 'POST');


/* Sign in */

const decodeJwt = (token) => {
  const decoded = jwt_decode(token);
  return decoded;
};

const loginForm = document.getElementById('login-form');

/**
* Submits a form to an endpoint with a specified http method
* @param { String } form - the form element
* @param { String } apiPath - the api path called
* @param { String } method - the http methos
*/
const login = (form, apiPath, method) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = getFormData(event);
    fetch(apiPath, {
      method,
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
        window.localStorage.setItem('Authorization', `Bearer ${result.token}`);
        let redirectDashboard;
        if (decodeJwt(result.token).role === 'user') {
          redirectDashboard = () => window.location.replace('/dashboard');
        } else {
          redirectDashboard = () => window.location.replace('/admin');
        }
        setTimeout(redirectDashboard, 2000);
      })
      .catch((error) => {
        output[0].innerHTML = error.stack;
      });
  });
};

login(loginForm, '/api/v1/auth/login', 'POST');
