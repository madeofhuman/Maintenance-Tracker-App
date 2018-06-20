
/* Page elements */
const username = document.getElementById('username');
const requestStatusDropdown = document.getElementById('request-status-dropdown');
const newRequestButton = document.getElementById('new-request-btn');
const tableWrapper = document.getElementById('table-wrapper');
const sortGroup = document.getElementById('table-sort');

/* Set welcome message */
const user = JSON.parse(window.localStorage.getItem('maintain-r-user'));
username.innerHTML += `${user.firstName}.`;

/* Fetch API */
const requestsUrl = '/api/v1/requests';

/* Get all requests */

fetch(requestsUrl, {
  headers: {
    Authorization: window.localStorage.getItem('maintain-r-authorization'),
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
      for (let i = 0; i < data.result.length; i += 1) {
        const row = requestsTable.insertRow();
        row.classList.add('white');

        const sn = row.insertCell();
        const item = row.insertCell();
        const model = row.insertCell();
        const type = row.insertCell();
        const detail = row.insertCell();
        const status = row.insertCell();
        const action = row.insertCell();

        sn.innerHTML = i + 1;
        item.innerHTML = data.result[i].item;
        model.innerHTML = data.result[i].model;
        type.innerHTML = data.result[i].type;
        detail.innerHTML = data.result[i].detail;
        status.innerHTML = data.result[i].status;
        action.innerHTML = `<a href="/admin/view?id=${data.result[i].id}"><input type="button" value="View" class="button"></a>`;
      }
    }
  }).catch(error => console.error(error));
