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
    // if (formData.item.trim() === '' || formData.detail.trim() === '') {
    //   return alert('Item and Description fields cannot be empty');
    // }
    if (formData.model === '') formData.model = 'N/A';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: window.localStorage.getItem('maintain-r-authorization'),
    };
    submitForm(formData, apiPath, 'POST', headers, event, '/dashboard');
  });
};

createRequest(requestForm, url);
