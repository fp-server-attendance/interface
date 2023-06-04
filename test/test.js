const { expect } = require('chai');
const chai = require('chai');
// Chai HTTP provides an interface for live integration testing via superagent
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
var assert = chai.assert;
// using nock library to stimulate server responses
const nock = require('nock');
// functions in login.js
//const { sendDataForTesting } = require('../Test Js Files/testLogin');
const { sendDataForSessionID } = require('../Test Js Files/testLogin');
const { sendData } = require('../Test Js Files/testLogin');
// functions in mainPage.js
const { getData } = require('../Test Js Files/testMainPage');
const { getDataForTesting } = require('../Test Js Files/testMainPage');

const serverIP = 'http://44.202.194.46:8080';

// to use sessionID for the rest of the tests
var sessionIdTest = "";

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

const sendDataForTesting = (username, password) => {
  return sendHttpRequest('POST', 'http://44.202.194.46:8080/teacher/authenticate', {
    username: username,
    password: password
  })
    .then(responseData => {
      if (responseData.success) {
        sessionIdTest = responseData.sessionId;
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


describe('Web Server Connection', () => {
  it('server should connect successfully', function (done) {
    chai.request(serverIP)
      .get('/')
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        done();
      }); 
  });
})
describe('Login Tests', () => {
  it('should login successfully with valid credentials', async function() {

    const username = 'seraslan';
    const password = 'abc123';
    // using nock library to stimulate server responses
    nock(serverIP)
      .post('/teacher/authenticate', { username, password })
      .reply(404, { success: true });
    
    // Exercise
    const result = await sendDataForTesting(username, password);

    //sessionIdTest = await sendDataForSessionID(username, password);
    
    // Verify
    expect(result).to.be.true;
  });

  it('should fail to login with invalid credentials', async function() {
    // Setup
    const username = 'wrongUsername';
    const password = 'wrongPassword';

    nock(serverIP)
      .post('/teacher/authenticate', { username, password })
      .reply(404, { success: false });

    // Exercise
    const result = await sendDataForTesting(username, password);
    
    // Verify
    expect(result).to.be.false;
  });

  it('Check whether appropriate error messages are thrown or not',async function() {

    const username = 'wrongUsername';
    const password = 'wrongPassword';

    nock(serverIP)
      .post('/teacher/authenticate', { username, password })
      .reply(404, { success: false });

      try {
        await sendData(username, password);
      } catch (err) {
        assert.strictEqual(err.message, "Please check your login information.");
      }

  });

});
describe('Main Page Tests', () => {
  it('should list courses successfully with valid credentials', async function() {
    const sectionYear = 2023;
    const semester = 'SPRING';
    const teacherUserName = 'seraslan';
    const sessionId = sessionIdTest;
    
    // using nock library to stimulate server responses
    nock(serverIP)
      .post('/teacher/courses', {sectionYear, semester, teacherUserName, sessionId})
      .reply(404, { success: true });

    // Exercise
    const result = await getDataForTesting(sectionYear, semester, teacherUserName, sessionId);
    
    // Verify
    expect(result).to.be.true;
  });

  it('should fail to list courses with invalid credentials', async function() {
    const sectionYear = '2023';
    const semester = 'fall';
    const teacherUserName = 'seraslan';
    const sessionId = "c07f3e4f-9efe-4de2-abc0-40ecd84f4b74";

    // using nock library to stimulate server responses
    nock(serverIP)
      .post('/teacher/courses', {sectionYear, semester, teacherUserName, sessionId})
      .reply(404, { success: false });

    // Exercise
    const result = await getDataForTesting(sectionYear, semester, teacherUserName, sessionId);

    // Verify
    expect(result).to.be.false;
  });
});

// function getting from testaddStudent.js file
const { sendDataForAddStudent } = require('../Test Js Files/testaddStudent');

var minm = 100000;
var maxm = 999999;
var randomNum = Math.floor(Math
.random() * (maxm - minm + 1)) + minm;
describe('Add Student Tests', () => {
  it('should add students successfully with valid credentials', async function() {
    const studentNumber = randomNum;
    const name = "test12";
    const surname = "test22";
    const adminUserName = "seraslan";
    const sessionId = sessionIdTest;
    const fingerprintImage = "odbpoXHFGIb7xWcu4ac7SQ==";

    // using nock library to stimulate server responses
    nock(serverIP)
      .post('/student/add', {studentNumber, name, surname, adminUserName, sessionId, fingerprintImage})
      .reply(200, { success: true });

    // Exercise
    const result = await sendDataForAddStudent(studentNumber, name, surname, adminUserName, sessionId, fingerprintImage);

    // Verify
    expect(result).to.be.true;
  });

  it('should fail to add students with invalid credentials', async function() {
    const studentNumber = 123123123;
    const name = "invalidName";
    const surname = "invalidSurname";
    const adminUserName = "seraslan";
    const sessionId = sessionIdTest;
    const fingerprintImage = "odbpoXHFGIb7xWcu4ac7SQ==";

    // using nock library to stimulate server responses
    nock(serverIP)
      .post('/student/add', {studentNumber, name, surname, adminUserName, sessionId, fingerprintImage})
      .reply(400, { success: false });

    // Exercise
    const result = await sendDataForAddStudent(studentNumber, name, surname, adminUserName, sessionId, fingerprintImage);
    
    // Verify
    expect(result).to.be.false;
  });
})

// function getting from testaddLecture.js file
const { sendDataForAddLecture } = require('../Test Js Files/testaddLecture');

describe('Add Lecture Tests', () => {
  it('should add lecture successfully with valid credentials', async function() {
    const coursecode = 3550666;
    const department = "CNG";
    const coursename = "testcoursename";
    const adminUserName = "seraslan";
    const sessionId = sessionIdTest;
    // using nock library to stimulate server responses
    nock(serverIP)
      .post('/course/add', {coursecode, department, coursename, adminUserName, sessionId})
      .reply(404, { success: true });

    // Exercise
    const result = await sendDataForAddLecture(coursecode, department, coursename, adminUserName, sessionId);
    
    // Verify
    expect(result).to.be.true;
  });

  it('should add lecture successfully with valid credentials', async function() {
    const coursecode = 123456;
    const department = "InvalidDepartment";
    const coursename = "InvalidName";
    const adminUserName = "seraslan";
    const sessionId = sessionIdTest;
    // using nock library to stimulate server responses
    nock(serverIP)
      .post('/course/add', {coursecode, department, coursename, adminUserName, sessionId})
      .reply(404, { success: false });

    // Exercise
    const result = await sendDataForAddLecture(coursecode, department, coursename, adminUserName, sessionId);
    
    // Verify
    expect(result).to.be.false;
  });
})

// function getting from testaddSection.js file
const { sendDataForSection } = require('../Test Js Files/testaddSection');

describe('Add Sections Tests', () => {
  it('should add section successfully with valid credentials', async function() {
    const courseID = 3550491;
    const sectionYear = 2023;
    const sectionNumber = 7;
    const semester = "SPRING";
    const teacherUserName = "seraslan";
    const adminUserName = "seraslan";
    const sessionId = sessionIdTest;
    // using nock library to stimulate server responses
    nock(serverIP)
      .post('/course/section/add', {courseID, sectionYear, sectionNumber, semester, teacherUserName, adminUserName, sessionId})
      .reply(404, { success: true });

    // Exercise
    const result = await sendDataForSection(courseID, sectionYear, sectionNumber, semester, teacherUserName, adminUserName, sessionId);
    
    // Verify
    expect(result).to.be.true;
  });

  it('should fail to add section with invalid credentials', async function() {
    const courseID = 3550491;
    const sectionYear = 2023;
    const sectionNumber = 1;
    const semester = "invalidSemester";
    const teacherUserName = "invalidName";
    const adminUserName = "seraslan";
    const sessionId = sessionIdTest;
    // using nock library to stimulate server responses
    nock(serverIP)
      .post('/course/section/add', {courseID, sectionYear, sectionNumber, semester, teacherUserName, adminUserName, sessionId})
      .reply(404, { success: false });

    // Exercise
    const result = await sendDataForSection(courseID, sectionYear, sectionNumber, semester, teacherUserName, adminUserName, sessionId);
    
    // Verify
    expect(result).to.be.false;
  });
})

// function getting from testaddInstructor.js file
const { sendDataForInstructor } = require('../Test Js Files/testaddInstructor');

describe('Add Instructor Tests', () => {
  it('should add instructor successfully with valid credentials', async function() {
    const username = "UserTest78910";
    const password = "testpassword";

    // using nock library to stimulate server responses
    nock(serverIP)
      .post('/teacher/add', {username, password})
      .reply(404, { success: true });

    // Exercise
    const result = await sendDataForInstructor(username, password);
    
    // Verify
    expect(result).to.be.true;
  });

  it('should fail to add instructor with invalid credentials', async function() {
    const username = "seraslan";
    const password = "abc123";

    // using nock library to stimulate server responses
    nock(serverIP)
      .post('/teacher/add', {username, password})
      .reply(404, { success: false });

    // Exercise
    const result = await sendDataForInstructor(username, password);
    
    // Verify
    expect(result).to.be.false;
  });
})


// function getting from testAttendance.js file
const { getDataForAttendance } = require('../Test Js Files/testAttendance');
const { sendDataForAttendance } = require('../Test Js Files/testAttendance');

describe('Attendance Page Tests', () => {
  it('should succesfully recieve attendance page with valid credentials', async function() {
    const attendanceId = 1;
    const teacherUserName = "seraslan";
    const sessionId = sessionIdTest;

    // using nock library to stimulate server responses
    nock(serverIP)
      .post('/attendance/get_details', {attendanceId, teacherUserName, sessionId})
      .reply(404, { success: true });

    // Exercise
    const result = await getDataForAttendance(attendanceId, teacherUserName, sessionId);
    
    // Verify
    expect(result).to.be.true;
  });
  it('should fail to recieve attendance page with invalid credentials', async function() {
    const attendanceId = 1;
    const teacherUserName = "invalidUser";
    const sessionId = sessionIdTest;

    // using nock library to stimulate server responses
    nock(serverIP)
      .post('/attendance/get_details', {attendanceId, teacherUserName, sessionId})
      .reply(404, { success: false });

    // Exercise
    const result = await getDataForAttendance(attendanceId, teacherUserName, sessionId);
    
    // Verify
    expect(result).to.be.false;
  });

  it('should succesfully send fingerprint to server with valid credentials', async function() {
    const attendanceId = 1;
    const teacherUserName = "seraslan";
    const sessionId = sessionIdTest;
    const encodedImage = "odbpoXHFGIb7xWcu4ac7SQ==";

    // using nock library to stimulate server responses
    nock(serverIP)
      .post('/attendance/get_details', {attendanceId, teacherUserName, sessionId, encodedImage})
      .reply(404, { success: true });

    // Exercise
    const result = await sendDataForAttendance(attendanceId, teacherUserName, sessionId, encodedImage);
    
    // Verify
    expect(result).to.be.true;
  });
  it('should fail to send fingerprint to server with invalid credentials', async function() {
    const attendanceId = 1;
    const teacherUserName = "invalidUser";
    const sessionId = sessionIdTest;
    const encodedImage = "odbpoXHFGIb7xWcu4ac7SQ==";

    // using nock library to stimulate server responses
    nock(serverIP)
      .post('/attendance/get_details', {attendanceId, teacherUserName, sessionId, encodedImage})
      .reply(404, { success: false });

    // Exercise
    const result = await sendDataForAttendance(attendanceId, teacherUserName, sessionId, encodedImage);
    
    // Verify
    expect(result).to.be.false;
  });
})