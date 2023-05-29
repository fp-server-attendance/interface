window.addEventListener('load', function () {
    const currDate = document.getElementById("currDate");
    const date = new Date();
    currDate.innerHTML = date.toLocaleDateString();

    getData();
});

const goStudentbtn = document.getElementById('go-addStudent-btn');
const goLecturebtn = document.getElementById('go-addLecture-btn');
const goInstructorbtn = document.getElementById('go-addInstructor-btn');

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

// event listener to send parameters from mainPage to adminPage
goStudentbtn.addEventListener('click', (event) => {
  event.preventDefault();
  window.location.href = `./addStudent.html?username=${encodeURIComponent(username)}&sessionId=${encodeURIComponent(sessionId)}`;
});

goLecturebtn.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = `./addLecture.html?username=${encodeURIComponent(username)}&sessionId=${encodeURIComponent(sessionId)}`;
  });

goInstructorbtn.addEventListener('click', (event) => {
  event.preventDefault();
  window.location.href = `./addInstructor.html?username=${encodeURIComponent(username)}&sessionId=${encodeURIComponent(sessionId)}`;
});