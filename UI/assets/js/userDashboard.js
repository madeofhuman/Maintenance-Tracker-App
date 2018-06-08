
/* Page elements */
const username = document.getElementById('username');
const requestStatusDropdown = document.getElementById('request-status-dropdown');
const newRequestButton = document.getElementById('new-request-btn');
const tableWrapper = document.getElementById('table-wrapper');
const sortGroup = document.getElementById('sort-group');

/* Set welocme message */
const user = JSON.parse(window.localStorage.getItem('User'));
console.log(user.firstName);
username.innerHTML += `${user.firstName}.`;

/* Fetch API */
const requestsUrl = '/api/v1/users/requests';

/* Get user's requests */
fetch(requestsUrl, {
  headers: {
    Authorization: window.localStorage.getItem('Authorization'),
  },
})
  .then(response => response.json())
  .then((data) => {
    if (data.result.length < 1) {
      sortGroup.classList.add('hidden');
      tableWrapper.innerHTML = `
        <div class="wrapper white">
          <p>${data.message}</p>
        </div>
      `;
    } else {
      let i = 0;
      tableWrapper.innerHTML = `
        <table class="table white" id="requests-table">
          <thead class="orange">
            <tr>
              <th>S/N</th>
              <th>Item Name</th>
              <th>Model</th>
              <th>Request Type</th>
              <th>Description</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      `;
      const requestsTable = document.getElementById('requests-table');
      data.result.forEach((request) => {
        i += 1;
        const row = requestsTable.insertRow();
        row.classList.add('white');

        const sn = row.insertCell();
        const item = row.insertCell();
        const model = row.insertCell();
        const type = row.insertCell();
        const detail = row.insertCell();
        const status = row.insertCell();
        const action = row.insertCell();

        sn.innerHTML = i;
        item.innerHTML = request.item;
        model.innerHTML = request.model;
        type.innerHTML = request.type;
        detail.innerHTML = request.detail;
        status.innerHTML = request.status;
        action.innerHTML = `<a href="/view?id=${request.id}"><input type="button" value="View" class="button"></a>`;
      });
    }
  }).catch(error => console.log(error));
