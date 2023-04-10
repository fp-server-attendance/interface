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
  });
};
var myBooks;
const getData = () => {
  sendHttpRequest('GET', 'http://localhost:8081/attendance/list  ').then(responseData => {
    console.log(responseData);
    //myBooks = JSON.stringify(responseData, null, 2);
    myBooks = responseData.matchedStudents;
    console.log(myBooks);
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

getBtn.addEventListener('click', getData);
postBtn.addEventListener('click', sendData);