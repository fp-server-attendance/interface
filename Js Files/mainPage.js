window.addEventListener('load', function () {
    const currDate = document.getElementById("currDate");
    const date = new Date();
    currDate.innerHTML = date.toLocaleDateString();

    getData();
  });

const currYear = '2023';
const currSemester = 'SPRING'

const goAdminbtn = document.getElementById('go-adminPage-btn');
const getBtn = document.getElementById('get-lectures-btn');

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
    sectionYear: currYear,
    semester: currSemester,
    teacherUserName: username,
    sessionId: sessionId
  };
  sendHttpRequest('POST', `http://3.92.152.158:8080/teacher/courses`, data)
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
      //start attendance button
      const attendanceButton = document.createElement("button");
      attendanceButton.innerHTML = "Start Attendance";
      attendanceButton.style.marginRight = "10px";
      //options for sections
      // options for sections
      getSectionList(courses[i].id).then(sections => {
        const sectionSelect = document.createElement("select");
        sectionSelect.style.marginLeft = "10px";
        for (let j = 0; j < sections.length; j++) {
          const option = document.createElement("option");
          option.value = sections[j];
          option.text = "Section " + sections[j];
          sectionSelect.appendChild(option);
        }
        courseDiv.appendChild(sectionSelect);

        // Append courseDiv to container here
        container.appendChild(courseDiv);
      });

      attendanceButton.addEventListener('click', goToAttendancePage);
      courseDiv.appendChild(attendanceButton);

      //previous attendances button
      const newButton = document.createElement("button");
      newButton.innerHTML = "Previous Attendances";
      newButton.style.marginRight = "10px";

      // Attach event listener to the new button
      newButton.addEventListener('click', goToPreviousAttendancePage);

      courseDiv.appendChild(newButton);

      container.appendChild(courseDiv);

      
    }

    // Now, add the newly created container with course data, to a div.
    const divShowData = document.getElementById('showData');
    divShowData.innerHTML = "";
    divShowData.appendChild(container);
  });
};

function goToPreviousAttendancePage(event) {
  // get course code and selected section from the event target's parent container
  const courseDiv = event.target.parentNode;
  const courseCode = courseDiv.querySelector('h2').textContent.split(' ')[0];
  const sectionSelect = courseDiv.querySelector('select');
  const selectedSection = sectionSelect.options[sectionSelect.selectedIndex].value;

  window.location.href = `./previousAttendances.html?username=${encodeURIComponent(username)}&sessionId=${encodeURIComponent(sessionId)}&courseCode=${encodeURIComponent(courseCode)}&selectedSection=${encodeURIComponent(selectedSection)}`;
}

function goToAttendancePage(event) {
  // get course code and selected section from the event target's parent container
  const courseDiv = event.target.parentNode;
  const courseCode = courseDiv.querySelector('h2').textContent.split(' ')[0];
  const sectionSelect = courseDiv.querySelector('select');
  const selectedSection = sectionSelect.options[sectionSelect.selectedIndex].value;
  
  // get attendance id
  getDataAttendanceId(courseCode, selectedSection).then(attendanceId => {
    window.location.href = `./attendance.html?username=${encodeURIComponent(username)}&sessionId=${encodeURIComponent(sessionId)}&attendanceId=${encodeURIComponent(attendanceId)}`;
  });
}


// getting attendance ID and sending with attendance
const getSectionList = (courseCode) => {
  return sendHttpRequest('POST', 'http://3.92.152.158:8080/course/section/list', {
    courseCode: courseCode,
    sectionYear: currYear,
    semester: currSemester,
    teacherUserName: username,
    sessionId: sessionId
  })
    .then(responseData => {
      console.log(responseData);
      return responseData.sectionNumbers;
    })
    .catch(err => {
      console.log(err, err.data);
    });
};

// getting attendance ID and sending with attendance
const getDataAttendanceId = (courseCode, sectionNumber) => {
  return sendHttpRequest('POST', 'http://3.92.152.158:8080/attendance/add', {
    courseCode: courseCode,
    sectionNumber: sectionNumber,
    sectionYear: currYear,
    semester: currSemester,
    teacherUserName: username,
    sessionId: sessionId
  })
    .then(responseData => {
      console.log(responseData);
      return responseData.id;
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

// event listener to send parameters from mainPage to adminPage
goAdminbtn.addEventListener('click', (event) => {
  event.preventDefault();

  window.location.href = `./adminPage.html?username=${encodeURIComponent(username)}&sessionId=${encodeURIComponent(sessionId)}`;

});