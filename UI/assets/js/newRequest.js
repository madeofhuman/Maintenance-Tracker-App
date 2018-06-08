/* Page elements */
const requestForm = document.getElementById('new-request-form');

/* Fetch API */
const url = '/api/v1/users/requests';

/* Create request */

const output = document.getElementById('output');

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
const createRequest = (form, apiPath, method) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = getFormData(event);
    if (formData.model === '') formData.model = 'N/A';
    fetch(apiPath, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: window.localStorage.getItem('Authorization'),
      },
      body: JSON.stringify(formData),
    }).then(response => response.json())
      .then((result) => {
        console.log(result);
        if (result.statusCode !== 201) {
          const textInBracket = result.message.match(/\[(.*?)\]/);
          if (textInBracket) {
            output.innerHTML = textInBracket[1].toLowerCase();
            return;
          }
          output.innerHTML = result.message;
          return;
        }
        output.innerHTML = 'request created successfully';
        const redirectDashboard = () => window.location.replace('/dashboard');
        setTimeout(redirectDashboard, 2000);
      })
      .catch((error) => {
        output.innerHTML = error;
      });
  });
};

createRequest(requestForm, url, 'POST');

