/* eslint no-undef:  0 */

/* Page elements */
const wrapper = document.getElementById('wrapper');

/* Fetch API */
const urlString = window.location.href;
const url = new URL(urlString);
const param = url.searchParams.get('id');
const requestUrl = `/api/v1/requests/${param}`;

/* Get request */
fetch(requestUrl, {
  method: 'GET',
  headers: {
    Authorization: window.localStorage.getItem('Authorization'),
  },
})
  .then(response => response.json())
  .then((data) => {
    console.log(data);
    if (!data.result) {
      displayMessage('The request id you entered does not exist', '/admin');
    } else {
      wrapper.innerHTML = `
        <div class="card white">
          <div class="row">
            <h2 id="title" class="left orange"></h2>
            <p id="date" class="right"></p>
          </div>
          <small class="left white small" id="model"></small>
          <em id="status"></em>
          <br>
          <div class="row">
            <div class="left" id="owner"></div>
          </div>
          <br>
          <div class="row">
            <em id="detail"></em>
          </div>
          <br>
          <br>
          <br>
          <div class="row center" id="request-btns">
          </div>
        </div>
      `;
      const { result } = data;
      const requestButtons = document.getElementById('request-btns');

      if (result.status === 'in-review') {
        requestButtons.innerHTML = `
          <input type="button" onclick="approveRequest()" class="button left green-bg white" id="approve-btn" value="Approve">
          <br>
          <input type="button" onclick="disapproveRequest()" class="button left green-bg white" id="disapprove-btn" value="Disapprove">
        `;
      } else if (result.status === 'pending') {
        requestButtons.innerHTML = `
          <input type="button" onclick="resolveRequest()" class="button left green-bg white" id="resolve-btn" value="Resolve">
        `;
      } else if (result.status === 'disapproved' || result.status === 'resolved') {
        requestButtons.innerHTML = `
          <input type="button" class="button left green-bg white" id="resolve-btn" value="Request Completed">
        `;
      }

      const title = document.getElementById('title');
      const date = document.getElementById('date');
      const model = document.getElementById('model');
      const owner = document.getElementById('owner');
      const status = document.getElementById('status');
      const detail = document.getElementById('detail');
      title.innerHTML = `${result.item}, ${result.type}`;
      date.innerHTML = `${new Date(result.created_at).toDateString()}`;
      model.innerHTML = `${result.model} - `;
      status.innerHTML = `&nbsp${result.status}`;
      owner.innerHTML = `by ${result.owner}`;
      detail.innerHTML = `${result.detail}`;
    }
  }).catch(error => console.error(error));

