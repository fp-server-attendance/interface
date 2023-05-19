const getBtn = document.getElementById('get-lecture-btn');
const postBtn = document.getElementById('send-login-btn');

const sendHttpRequest = (method, url, data) => {
  return fetch(url, {
    method: method,
    body: JSON.stringify(data),
    headers: data ? { 'Content-Type': 'application/json' } : {}
  }).then(response => {
    if (response.status >= 400) {
      return response.json().then(errResData => {
        const error = new Error('Something went wrong!');
        error.data = errResData;
        throw error;
      });
    }
    return response.json();
  });
};

const sendData = (username, password, cpassword, fName, lName, email) => {
  sendHttpRequest('POST', 'http://54.227.120.179:8080/teacher/add', {
    username: username,
    password: password,
    cpassword: cpassword,
    fName: fName,
    lName: lName,
    email: email

  })
    .then(responseData => {
      if (responseData.success) {
        console.log(responseData.sessionId);
        alert('You are signed up.');
        // directing to login page with user credentials if register is succesfull
        window.location.href = './login.html';
      } else {
        alert('Please check your login information.');
      }
    })
    .catch(err => {
      console.log(err, err.data);
    });
};

// get data from html page
postBtn.addEventListener('click', (event) => {
  event.preventDefault();

  const usernameInput = document.querySelector('input[name="username"]');
  const passwordInput = document.querySelector('input[name="password"]');
  const confirmpasswordInput = document.querySelector('input[name="conf_password"]');
  const firstnameInput = document.querySelector('input[name="firstname"]');
  const lastnameInput = document.querySelector('input[name="lastname"]');
  const emailInput = document.querySelector('input[name="email"]');
  // send data to sendData
  sendData(usernameInput.value, passwordInput.value, confirmpasswordInput.value, firstnameInput.value, lastnameInput.value, emailInput.value);
});
