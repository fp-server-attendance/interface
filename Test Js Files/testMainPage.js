const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// Now you can use `window` and `document` from `jsdom`
const { window } = new JSDOM(``, { url: "http://44.202.194.46" });
const { document } = window;


module.exports = function(window) {
    window.addEventListener('load', function () {
        const currDate = document.getElementById("currDate");
        const date = new Date();
        currDate.innerHTML = date.toLocaleDateString();

        getData();
    });
}
module.exports = function(document) {
const getBtn = document.getElementById('get-lectures-btn');
}

const sendHttpRequest = (method, url, data) => {
  return fetch(url, {
    method: method,
    body: JSON.stringify(data),
    headers: data ? { 'Content-Type': 'application/json' } : {}
  }).then(response => {
    if (response.status >= 500) {
      return response.json().then(errResData => {
        const error = new Error('Something went wrong!');
        error.data = errResData;
        throw error;
      });
    }
    return response.json();
  });
};

const { username, sessionId } = getQueryParams();

const getDataForTesting = (sectionYear, semester, username, sessionId) => {
    const data = {
        sectionYear: sectionYear,
        semester: semester,
        teacherUserName: username,
        sessionId: sessionId
      };
    return sendHttpRequest('POST', `http://44.202.194.46:8080/teacher/courses`, data)
      .then(responseData => {
        if (responseData.success) {
          return responseData.success;
        } else {
          return false;
        }
      })
      .catch(err => {
        console.log(err, err.data);
        throw err;
      });
  };

function goToAttendancePage() {
  window.location.href = "./attendance.html";
}

// get login parameters from login.js and use it here to get the courses of a user
function getQueryParams() {
  const search = window.location.search.substring(1);
  const queryParams = new URLSearchParams(search);

  return {
    username: queryParams.get('username'),
    sessionId: queryParams.get('sessionId')
  };
}
module.exports = {
    sendHttpRequest,
    getDataForTesting
  };