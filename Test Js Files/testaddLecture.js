window.addEventListener('load', function () {
    const currDate = document.getElementById("currDate");
    const date = new Date();
    currDate.innerHTML = date.toLocaleDateString();

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
      if (response.status >= 500) {
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

const sendData = (coursecode, department, coursename) => {
    sendHttpRequest('POST', 'http://44.203.249.113:8080/course/add', {
        courseCode: coursecode,
        department: department,
        name: coursename,
        adminUserName: username,
        sessionId: sessionId
    })
      .then(responseData => {
        console.log(responseData);
      })
      .catch(err => {
        console.log(err, err.data);
      });
};

const sendDataForTesting = (coursecode, department, coursename) => {
    sendHttpRequest('POST', 'http://44.203.249.113:8080/course/add', {
        courseCode: coursecode,
        department: department,
        name: coursename,
        adminUserName: username,
        sessionId: sessionId
    })
      .then(responseData => {
        if (responseData.success) {
            return responseData.success;
        } else {
            return false;
        }
      })
      .catch(err => {
        console.log(err, err.data);
      });
};

// get login parameters from login.js and use it here to get the courses of a user
function getQueryParams() {
  const search = window.location.search.substring(1);
  const queryParams = new URLSearchParams(search);

  return {
    username: queryParams.get('username'),
    sessionId: queryParams.get('sessionId')
  };
}

// get data from html page
submitBtn.addEventListener('click', (event) => {
    event.preventDefault();
  
    const courseCodeInput = document.querySelector('input[name="courseCode"]');
    const departmentInput = document.querySelector('input[name="department"]');
    const courseNameInput = document.querySelector('input[name="courseName"]');
    // send data to sendData

    sendData(courseCodeInput.value, departmentInput.value, courseNameInput.value);
});

module.exports = {
    sendHttpRequest,
    sendData,
    sendDataForTesting
};