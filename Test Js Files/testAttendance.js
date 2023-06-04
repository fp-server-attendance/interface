const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// Now you can use `window` and `document` from `jsdom`
const { window } = new JSDOM(``, { url: "http://44.202.194.46" });
const { document } = window;

window.addEventListener('load', function () {
    const currDate = document.getElementById("currDate");
    const date = new Date();
    currDate.innerHTML = date.toLocaleDateString();
  });
  
const postBtn = document.getElementById('send-fingerprint-btn');

const { username, sessionId } = getQueryParams();

let intervalId = null;
const toggleSwitch = document.getElementById('toggle-switch');
const switchStatus = document.getElementById('switch-status');

//const jsonToTable = require('json-to-table');

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
var myBooks;

const getDataForAttendance = (attendanceId, username, sessionId) => {
    return sendHttpRequest('POST', 'http://44.202.194.46:8080/attendance/get_details', {
        attendanceId: attendanceId,
        teacherUserName: username,
        sessionId: sessionId
    })
    .then(responseData => {
        if (responseData.success) {
            return true;
        } else {
            return false;
        }
    })
    .catch(err => {
        //console.log(err, err.data);
        return false;
    });
};

const sendDataForAttendance = (attendanceId, username, sessionId, base64String) => {
    return sendHttpRequest('POST', 'http://44.202.194.46:8080/attendance/schedule_fingerprint_image', {
        attendanceId: attendanceId,
        teacherUserName: username,
        sessionId: sessionId,
        encodedImage: base64String
    })
    .then(responseData => {
        if (responseData.success) {
            return true;
        } else {
            return false;
        }
    })
    .catch(err => {
        //console.log(err, err.data);
        return false;
    });
};
  

  
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
    getDataForAttendance,
    sendDataForAttendance
};