/* eslint no-unused-vars:  0 */
/* eslint no-undef:  0 */


/* Delete request */

/**
* deletes the specified request
*/
const deleteRequest = () => {
  fetch(requestUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: window.localStorage.getItem('Authorization'),
    },
  }).then(response => response.json())
    .then((result) => {
      if (result.statusCode !== 200) {
        const textInBracket = result.message.match(/\[(.*?)\]/);
        if (textInBracket) {
          displayMessage(textInBracket, `/view?id=${param}`);
        }
        displayMessage(result.message, `/view?id=${param}`);
      }
      displayMessage(result.message, '/dashboard');
    })
    .catch((error) => {
      console.log(error);
      displayMessage(error);
    });
};
