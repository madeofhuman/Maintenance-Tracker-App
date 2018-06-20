/* eslint no-undef: 0 */

/* Page elements */
const requestForm = document.getElementById('new-request-form');
const submitButton = document.getElementById('new-request-btn');
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
    Authorization: window.localStorage.getItem('maintain-r-authorization'),
  },
}).then(response => response.json())
  .then((data) => {
    // prevent direct url call
    if (data.result.status !== 'in-review') {
      submitButton.disabled = true;
      submitButton.classList.add('hidden');
      return displayMessage('This request has already been approved. You cannot update an approved resuest', '/dashboard');
    }

    if (data.result.length < 1) {
      displayMessage('The request id you entered does not exist', '/dashboard');
    } else {
      const { result } = data;
      type.value = result.type;
      item.value = result.item;
      model.value = result.model;
      detail.value = result.detail;
    }
  }).catch(error => console.error(error));

/* Edit request */

/**
* Submits a form to an endpoint with a specified http method
* @param { String } form - the form element
* @param { String } apiPath - the api path called
* @param { String } method - the http methos
*/
const updateRequest = (form, apiPath) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = getFormData(event);
    if (formData.model === '') formData.model = 'N/A';
    formData.type = formData.type.toLowerCase();
    const headers = {
      'Content-Type': 'application/json',
      Authorization: window.localStorage.getItem('Authorization'),
    };
    submitForm(formData, apiPath, 'PUT', headers, event, `/view?id=${param}`);
  });
};

updateRequest(requestForm, requestUrl);

