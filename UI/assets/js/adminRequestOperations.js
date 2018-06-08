/* Fetch API */

/* Approve request */

/**
* approve the specified request
*/
const approveRequest = () => {
  fetch(`${requestUrl}/approve`, {
    method: 'PUT',
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
          window.location.replace(`/admin/view?id=${param}`);
        }
        output.innerHTML = result.message;
        window.location.replace(`/admin/view?id=${param}`);
      }
      output.innerHTML = 'request approved';
      const redirectDashboard = () => window.location.replace('/admin');
      setTimeout(redirectDashboard, 2000);
    })
    .catch((error) => {
      console.log(error);
      output.innerHTML = error;
    });
};

/* Fetch API */

/* Disapprove request */

/**
* disapprove the specified request
*/
const disapproveRequest = () => {
  fetch(`${requestUrl}/disapprove`, {
    method: 'PUT',
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
          window.location.replace(`/admin/view?id=${param}`);
        }
        output.innerHTML = result.message;
        window.location.replace(`/admin/view?id=${param}`);
      }
      output.innerHTML = 'request disapproved';
      const redirectDashboard = () => window.location.replace('/admin');
      setTimeout(redirectDashboard, 2000);
    })
    .catch((error) => {
      console.log(error);
      output.innerHTML = error;
    });
};

/* Fetch API */

/* Resolve request */

/**
* resolve the specified request
*/
const resolveRequest = () => {
  fetch(`${requestUrl}/resolve`, {
    method: 'PUT',
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
          window.location.replace(`/admin/view?id=${param}`);
        }
        output.innerHTML = result.message;
        window.location.replace(`/admin/view?id=${param}`);
      }
      output.innerHTML = 'request resolved';
      const redirectDashboard = () => window.location.replace('/admin');
      setTimeout(redirectDashboard, 2000);
    })
    .catch((error) => {
      console.log(error);
      output.innerHTML = error;
    });
};

