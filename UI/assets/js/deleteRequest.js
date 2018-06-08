/* Fetch API */

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
          output.innerHTML = textInBracket[1].toLowerCase();
          window.location.replace(`/view?id=${param}`);
        }
        output.innerHTML = result.message;
        window.location.replace(`/view?id=${param}`);
      }
      output.innerHTML = 'request deleted successfully';
      const redirectDashboard = () => window.location.replace('/dashboard');
      setTimeout(redirectDashboard, 2000);
    })
    .catch((error) => {
      console.log(error);
      output.innerHTML = error;
    });
};
