/* eslint no-undef: 0 */

/* Page elements */
const requestForm = document.getElementById('new-request-form');

/* Fetch API */
const url = '/api/v1/users/requests';

/* Create request */

/**
* Creates a new request from user form input
* @param { String } form - the form element
* @param { String } apiPath - the api path called
*/
const createRequest = (form, apiPath) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = getFormData(event);
    if (formData.model === '') formData.model = 'N/A';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: window.localStorage.getItem('Authorization'),
    };
    submitForm(formData, apiPath, 'POST', headers, event, '/dashboard');
  });
};

createRequest(requestForm, url);
