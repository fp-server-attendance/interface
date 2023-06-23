window.addEventListener('load', function () {
    const currDate = document.getElementById("currDate");
    const date = new Date();
    currDate.innerHTML = date.toLocaleDateString();

  });

const submitBtn = document.getElementById('submitSection-btn');

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

const sendData = (coursecode, sectionYear, sectionNumber, semester, teacherUserName) => {
    sendHttpRequest('POST', 'http://3.227.232.2:8080/course/section/add', {
        courseID: coursecode,
        sectionYear: sectionYear,
        sectionNumber: sectionNumber,
        semester: semester,
        teacherUserName: teacherUserName, 
        adminUserName: username,
        sessionId: sessionId
    })
      .then(responseData => {
        console.log(responseData);
        if (responseData.success) {
          alert('Section was succesfully added to the database.');
        } else {
          alert('Failed to add.');
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
    const sectionYearInput = document.querySelector('input[name="sectionYear"]');
    const sectionNumberInput = document.querySelector('input[name="sectionNumber"]');
    const semesterInput = document.querySelector('input[name="semester"]');
    const teacherUserNameInput = document.querySelector('input[name="teacherUserName"]');

    // send data to sendData
    sendData(courseCodeInput.value, sectionYearInput.value, sectionNumberInput.value, semesterInput.value, teacherUserNameInput.value);
});

const goAdminbtn = document.getElementById('go-adminPage-btn');

// event listener to send parameters from mainPage to adminPage
goAdminbtn.addEventListener('click', (event) => {
  event.preventDefault();
  window.location.href = `./adminPage.html?username=${encodeURIComponent(username)}&sessionId=${encodeURIComponent(sessionId)}`;
});