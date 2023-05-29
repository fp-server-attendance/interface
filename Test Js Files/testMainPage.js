const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// Now you can use `window` and `document` from `jsdom`
const { window } = new JSDOM(``, { url: "http://44.203.249.113" });
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

const getData = () => {
  const data = {
    sectionYear: '2023',
    semester: 'fall',
    teacherUserName: username,
    sessionId: sessionId
  };
  sendHttpRequest('POST', `http://44.203.249.113:8080/teacher/courses`, data)
  .then(responseData => {
    console.log(username, sessionId)
    console.log(responseData);
    const courseData = responseData.courses;

    // Extract the course IDs and names into an array of objects
    const courses = Object.keys(courseData).map(courseId => ({
      id: courseId,
      name: courseData[courseId]
    }));

    console.log(courses);

    // Use the course data to populate the container
    const container = document.createElement("div");
    container.className = "course-container";

    // add course data to the container as separate mini containers.
    for (let i = 0; i < courses.length; i++) {
      const courseDiv = document.createElement("div");
      courseDiv.className = "mini-container";

      const courseTitle = document.createElement("h2");
      courseTitle.innerHTML = `${courses[i].id} - ${courses[i].name}`;
      courseDiv.appendChild(courseTitle);

      const attendanceButton = document.createElement("button");
      attendanceButton.innerHTML = "Start Attendance";
      attendanceButton.addEventListener('click', goToAttendancePage);
      courseDiv.appendChild(attendanceButton);

      container.appendChild(courseDiv);
    }

    // Now, add the newly created container with course data, to a div.
    const divShowData = document.getElementById('showData');
    divShowData.innerHTML = "";
    divShowData.appendChild(container);
  });
};

const getDataForTesting = (username, password) => {
    const data = {
        sectionYear: '2023',
        semester: 'fall',
        teacherUserName: username,
        sessionId: sessionId
      };
    return sendHttpRequest('POST', `http://44.203.249.113:8080/teacher/courses`, data)
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
    getData,
    getDataForTesting
  };