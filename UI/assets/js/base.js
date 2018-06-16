const hide = (element) => {
  element.classList.add('hidden');
};

const unhide = (element) => {
  element.classList.remove('hidden');
};

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
* @param { String } formData - the data from the form
* @param { String } apiPath - the api path called
* @param { String } method - the http methos
*/
const submitForm = (formData, apiPath, method) => {
  fetch(apiPath, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  }).then(response => response.json())
    .then((result) => {
      if (result.statusCode !== 200 || result.statusCode !== 201) {
        const bracket = result.message.match(/\[(.*?)\]/);
        if (bracket) {
          output[1].innerHTML = bracket[1].toLowerCase();
          return;
        }
        output[1].innerHTML = result.message;
        return;
      }
      output[1].innerHTML = result.message;
    })
    .catch((error) => {
      output[1].innerHTML = error;
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
  let redirectDashboard;
  if (decodeJwt(loginResult.token).role === 'user') {
    redirectDashboard = () => window.location.replace('/dashboard');
  } else {
    redirectDashboard = () => window.location.replace('/admin');
  }
  setTimeout(redirectDashboard, 2000);
};

/**
 * Redirect the authenticated user to their dashboard if they visit the landing page
 */
const redirectIfLoggedIn = () => {
  const user = JSON.parse(window.localStorage.getItem('User'));
  if (user !== null) {
    if (user.role === 'admin') {
      window.location.replace('/admin');
    }
    if (user.role === 'user') {
      window.location.replace('/dashboard');
    }
  }
};
