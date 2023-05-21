window.addEventListener('load', function () {
    const currDate = document.getElementById("currDate");
    const date = new Date();
    currDate.innerHTML = date.toLocaleDateString();

    getData();
  });

const getBtn = document.getElementById('get-lectures-btn');

const sendHttpRequest = (method, url, data) => {
  return fetch(url, {
    method: method,
    body: JSON.stringify(data),
    headers: data ? { 'Content-Type': 'application/json' } : {}
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json().then(jsonData => {
      if (!jsonData || Object.keys(jsonData).length === 0) {
        throw new Error('Empty response or invalid JSON');
      }
      return jsonData;
    });
  }).catch(error => {
    console.error('Error:', error);
  });
};

const { username, sessionId } = getQueryParams();

const getData = () => {
  sendHttpRequest('GET', `http://54.174.149.55:8080:8080/teacher/courses?teacherUserName=${encodeURIComponent(username)}&sessionId=${encodeURIComponent(sessionId)}&semester=fall&sectionYear=2023`)
  .then(responseData => {
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