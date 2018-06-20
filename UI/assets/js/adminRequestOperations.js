/* eslint no-unused-vars:  0 */
/* eslint no-undef:  0 */

/**
 * Perform admin operations on a request.
 * @param { String } apiPath - the API path for the request operation
 */
const requestOperation = (apiPath) => {
  fetch(apiPath, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: window.localStorage.getItem('maintain-r-authorization'),
    },
  }).then(response => response.json())
    .then((result) => {
      if (result.statusCode !== 200) {
        const textInBracket = result.message.match(/\[(.*?)\]/);
        if (textInBracket) {
          displayMessage(textInBracket, `/admin/view?id=${param}`);
        }
        displayMessage(result.message, `/admin/view?id=${param}`);
      }
      displayMessage(result.message, '/admin');
    })
    .catch((error) => {
      console.Error(error);
    });
};


/**
* Approve the specified request
*/
const approveRequest = () => {
  requestOperation(`${requestUrl}/approve`);
};


/**
* Disapprove the specified request
*/
const disapproveRequest = () => {
  requestOperation(`${requestUrl}/disapprove`);
};


/**
* Resolve the specified request
*/
const resolveRequest = () => {
  requestOperation(`${requestUrl}/resolve`);
};
