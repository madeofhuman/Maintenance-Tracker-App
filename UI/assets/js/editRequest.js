/* Page elements */
const requestForm = document.getElementById('new-request-form');
const type = document.getElementById('type');
const item = document.getElementById('item');
const model = document.getElementById('model');
const detail = document.getElementById('detail');

/* Fetch API */
const urlString = window.location.href;
const url = new URL(urlString);
const param = url.searchParams.get('id');
const requestUrl = `/api/v1/users/requests/${param}`;

/* Populate fields */
fetch(requestUrl, {
  headers: {
    Authorization: window.localStorage.getItem('Authorization'),
  },
}).then(response => response.json())
  .then((data) => {
    // prevent direct url call
    if (data.request.status !== 'in-review') {
      alert('This request has already been approved. You cannot update an approved resuest');
      window.location.replace('/dashboard');
    }

    if (data.request.length < 1) {
      alert('The request id you entered does not exist');
      window.location.replace('/dashboard');
    } else {
      const { request } = data;
      type.value = request.type;
      item.value = request.item;
      model.value = request.model;
      detail.value = request.detail;
    }
  }).catch(error => alert(error));

/* Edit request */
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
const updateRequest = (form, apiPath, method) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = getFormData(event);
    if (formData.model === '') formData.model = 'N/A';
    formData.type = formData.type.toLowerCase();
    fetch(apiPath, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: window.localStorage.getItem('Authorization'),
      },
      body: JSON.stringify(formData),
    }).then(response => response.json())
      .then((result) => {
        if (result.statusCode !== 201) {
          const textInBracket = result.message.match(/\[(.*?)\]/);
          if (textInBracket) {
            output.innerHTML = textInBracket[1].toLowerCase();
            return;
          }
          output.innerHTML = result.message;
          return;
        }
        output.innerHTML = 'request updated successfully';
      })
      .catch((error) => {
        output.innerHTML = error;
      });
  });
};

updateRequest(requestForm, requestUrl, 'PUT');

