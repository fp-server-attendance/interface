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

const getData = () => {
  sendHttpRequest('GET', '54.227.120.179:8080/teacher/courses').then(responseData => {
    console.log(responseData);
  });
};

const sendData = (username, password) => {
  sendHttpRequest('POST', 'http://54.227.120.179:8080/teacher/authenticate', {
    username: username,
    password: password
  })
    .then(responseData => {
      if (responseData.success) {
        console.log(responseData.sessionId);
        alert('You are logged in.');
        localStorage.setItem('sessionId', responseData.sessionId);
        // directing to mainPage with user credentials if login is succesfull
        window.location.href = './mainPage.html?username=${encodeURIComponent(username)}&sessionId=${encodeURIComponent(responseData.sessionId)}';
      } else {
        alert('Please check your login information.');
      }
    })
    .catch(err => {
      console.log(err, err.data);
    });
};

postBtn.addEventListener('click', (event) => {
  event.preventDefault();

  const usernameInput = document.querySelector('input[name="username"]');
  const passwordInput = document.querySelector('input[name="password"]');

  sendData(usernameInput.value, passwordInput.value);
});
