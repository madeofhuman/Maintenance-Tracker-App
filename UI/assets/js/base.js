/* eslint no-undef:  0 */
/* eslint no-param-reassign:  0 */
/* eslint no-unused-vars: 0 */

/**
 * Hides a HTML element
 * @param { String } element - the element to hide
 */
const hide = (element) => {
  element.classList.add('hidden');
};

/**
 * Unhides a HTML element
 * @param { String } element - the element to unhide
 */
const unhide = (element) => {
  element.classList.remove('hidden');
};

/**
 * Redirect to a url or path
 * @param { String } url - the url or path to redirect to
 */
const redirect = (url) => {
  setTimeout(() => window.location.replace(url), 1500);
};

/**
 * Displays the message from the API after a Fetch request
 * @param { String } fetchResult - the result object from a Fetch call
 * @param { Event } event - the form submit event if function is called in a form
 */
const displayFetchMessage = (fetchResult, event) => {
  const output = event.target.querySelector('.output') || document.getElementById('output');
  if (fetchResult.statusCode !== 201 || fetchResult.statusCode !== 200) {
    const textInBracket = fetchResult.message.match(/\[(.*?)\]/);
    if (textInBracket) {
      output.innerHTML = textInBracket[1].toLowerCase();
      return;
    }
    output.innerHTML = fetchResult.message;
    return;
  }
  output.innerHTML = fetchResult.message;
};

/**
 *
 * @param { String } message - The message to display
 * @param { String } redirectTo - The path to redirect to
 */
const displayMessage = (message, redirectTo) => {
  const output = document.getElementById('output');
  output.innerHTML = message;
  if (redirectTo) {
    window.setTimeout(() => window.location.replace(redirectTo), 1500);
  }
  return null;
};

// https://medium.com/@trekinbami/explanation-of-javascripts-reduce-with-a-real-world-use-case-f3f5014951e2
/**
 * Parse form input into JSON object with name element and key
 * and input value as value when a submit event is triggered on
 * the form
 * @param {String} event - the current event
 */
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
* @param { FormData } formData - the data from the form
* @param { String } apiPath - the api path
* @param { String } method - the http method
* @param { Object } headers - the HTTP headers to set
* @param { Event } event - the current event
* @param { String } redirectPath - the url to redirect to on successful form submit
*/
const submitForm = (formData, apiPath, method, headers, event, redirectPath) => {
  fetch(apiPath, {
    method,
    headers,
    body: JSON.stringify(formData),
  }).then(response => response.json())
    .then((result) => {
      displayFetchMessage(result, event);
      if (result.statusCode === 201 || result.statusCode === 200) {
        if (event.target.id === 'signup-form') {
          return null;
        }
        redirect(redirectPath);
      }
    })
    .catch((error) => {
      console.error(error.stack);
    });
};

/**
* Decodes the JWT and returns the decoded payload
* @param { String } token - the JWT to decode
*/
const decodeJwt = (token) => {
  const decoded = jwt_decode(token);
  return decoded;
};

/**
* Stores a JWT in localStorage on successful login
* @param { String } loginResult - the result from the body of a successful
* login response
*/
const setToken = (loginResult) => {
  window.localStorage.setItem('Authorization', `Bearer ${loginResult.token}`);
};


/**
* Redirects the user to appropriate dashboard based on role on successful login
* @param { String } loginResult - the result from the body of a successful
* login response
*/
const redirectOnLogin = (loginResult) => {
  if (decodeJwt(loginResult.token).role === 'user') {
    redirect('/dashboard');
  } else {
    redirect('/admin');
  }
};

/**
 * Redirect the authenticated user to their dashboard if they visit the landing page
 */
const redirectIfLoggedIn = () => {
  const user = JSON.parse(window.localStorage.getItem('User'));
  if (user !== null || user !== undefined) {
    if (user.role === 'admin') {
      window.location.replace('/admin');
    }
    if (user.role === 'user') {
      window.location.replace('/dashboard');
    }
  }
};
