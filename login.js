const getBtn = document.getElementById('get-lecture-btn');
const postBtn = document.getElementById('send-login-btn');

//const jsonToTable = require('json-to-table');

const sendHttpRequest = (method, url, data) => {
  return fetch(url, {
    method: method,
    body: JSON.stringify(data),
    headers: data ? { 'Content-Type': 'application/json' } : {}
  }).then(response => {
    if (response.status >= 400) {
      // !response.ok
      return response.json().then(errResData => {
        const error = new Error('Something went wrong!');
        error.data = errResData;
        throw error;
      });
    }
    return response.json();
  })
  .then(result => {
    if(result.message === "SUCCESS"){
      alert("You are logged in.");
      getData(); // Call getData after successful login
      this.goToMain();
      } else {
         alert("Please check your login information.");
      }
  });
};

const getData = () => {
  sendHttpRequest('GET', 'http://localhost:8081/attendance/list  ').then(responseData => {
    console.log(responseData);
  });
};

const sendData = () => {
    sendHttpRequest('POST', 'http://localhost:8081/attendance/schedule', {
      login: 'test1',
      password: '123'
    })
      .then(responseData => {
        console.log(responseData);
      })
      .catch(err => {
        console.log(err, err.data);
      });
  };

postBtn.addEventListener('click', sendData);