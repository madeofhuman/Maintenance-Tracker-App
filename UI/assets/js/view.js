/* Page elements */
const wrapper = document.getElementById('wrapper');
const output = document.getElementById('output');

/* Fetch API */
const urlString = window.location.href;
const url = new URL(urlString);
const param = url.searchParams.get('id');
const requestUrl = `/api/v1/users/requests/${param}`;

/* Get request */
fetch(requestUrl, {
  method: 'GET',
  headers: {
    Authorization: window.localStorage.getItem('Authorization'),
  },
})
  .then(response => response.json())
  .then((data) => {
    if (data.request.length < 1) {
      output.innerHTML = 'The request id you entered does not exist';
      window.location.replace('/dashboard');
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
      const { request } = data;
      const requestButtons = document.getElementById('request-btns');

      if (request.status === 'in-review') {
        requestButtons.innerHTML = `
          <br><br>
          <a href="/edit?id=${data.request.id}"><input type="button" class="button left green-bg white" id="edit-btn" value="      Edit      "></a>
          <br>
          <input type="button" onclick="deleteRequest()" class="button left green-bg white" id="delete-btn" value="   Delete   ">
          <br><br>
        `;
      }

      const title = document.getElementById('title');
      const date = document.getElementById('date');
      const model = document.getElementById('model');
      const owner = document.getElementById('owner');
      const status = document.getElementById('status');
      const detail = document.getElementById('detail');
      title.innerHTML = `${request.item}, ${request.type}`;
      date.innerHTML = `${new Date(request.created_at).toDateString()}`;
      model.innerHTML = `${request.model} - `;
      status.innerHTML = `&nbsp${request.status}`;
      owner.innerHTML = `by ${request.owner}`;
      detail.innerHTML = `${request.detail}`;
    }
  }).catch(error => console.log(error));

