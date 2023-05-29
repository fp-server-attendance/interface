window.addEventListener('load', function () {
    const currDate = document.getElementById("currDate");
    const date = new Date();
    currDate.innerHTML = date.toLocaleDateString();

    getData();
  });

const submitBtn = document.getElementById('submitStudent-btn');

const { username, sessionId } = getQueryParams();

// get login parameters from login.js and use it here to get the courses of a user
function getQueryParams() {
  const search = window.location.search.substring(1);
  const queryParams = new URLSearchParams(search);

  return {
    username: queryParams.get('username'),
    sessionId: queryParams.get('sessionId')
  };
}

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

const sendData = (studentNo, name, surname, base64String) => {
    sendHttpRequest('POST', 'http://54.174.149.55:8080/attendance/schedule', {
        studentNumber: studentNo,
        name: name,
        surname: surname,
        adminUserName: adminUserName,
        sessionId: sessionId,
        fingerprintImage: base64String
    })
      .then(responseData => {
        console.log(responseData);
      })
      .catch(err => {
        console.log(err, err.data);
      });
};

// Converting file to base64string to send to the server
// Get a reference to the file input
const fileInput = document.querySelector('input');
var base64String;
// Listen for the change event so we can capture the file
fileInput.addEventListener('change', (e) => {
    // Get a reference to the file
    const file = e.target.files[0];

    // Encode the file using the FileReader API
    const reader = new FileReader();
    reader.onloadend = () => {
        // Use a regex to remove data url part
        base64String = reader.result
            .replace('data:', '')
            .replace(/^.+,/, '');

        console.log(base64String);
        console.log(typeof(base64String));
        // Logs wL2dvYWwgbW9yZ...
    };
    reader.readAsDataURL(file);
});

// get data from html page
submitBtn.addEventListener('click', (event) => {
    event.preventDefault();
  
    const studentNoInput = document.querySelector('input[name="studentNo"]');
    const nameInput = document.querySelector('input[name="name"]');
    const surnameInput = document.querySelector('input[name="surname"]');
    // send data to sendData
    sendData(studentNoInput.value, nameInput.value, surnameInput.value, base64String);
});