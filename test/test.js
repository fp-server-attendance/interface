const { expect } = require('chai');
const chai = require('chai');
// Chai HTTP provides an interface for live integration testing via superagent
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
var assert = chai.assert;
// using nock library to stimulate server responses
const nock = require('nock');
// functions in login.js
const { sendDataForTesting } = require('../Test Js Files/testLogin');
const { sendDataForSessionID } = require('../Test Js Files/testLogin');
const { sendData } = require('../Test Js Files/testLogin');
// functions in mainPage.js
const { getData } = require('../Test Js Files/testMainPage');
const { getDataForTesting } = require('../Test Js Files/testMainPage');

const serverIP = 'http://44.203.249.113:8080';

// to use sessionID for the rest of the tests
const sessionIdTest = "";

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

    const username = 'admin1';
    const password = '122333';
    // using nock library to stimulate server responses
    nock(serverIP)
      .post('/teacher/authenticate', { username, password })
      .reply(404, { success: true });
    
    // Exercise
    const result = await sendDataForTesting(username, password);

    sessionIdTest = await sendDataForSessionID(username, password);
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
    const sectionYear = '2023';
    const semester = 'SPRING';
    const teacherUserName = 'admin1';
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
    const teacherUserName = 'admin1';
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
const { sendDataForTesting } = require('../Test Js Files/testaddStudent');

describe('Add Student Tests', () => {
  it('should add students successfully with valid credentials', async function() {
    const studentNumber = 2419497;
    const name = "ilyas";
    const surname = "coskun";
    const adminUserName = "admin1";
    const sessionId = sessionIdTest;
    const fingerprintImage = "odbpoXHFGIb7xWcu4ac7SQ==";

    // using nock library to stimulate server responses
    nock(serverIP)
      .post('/student/add', {studentNumber, name, surname, adminUserName, sessionId, fingerprintImage})
      .reply(404, { success: true });

    // Exercise
    const result = await sendDataForTesting(studentNumber, name, surname, adminUserName, sessionId, fingerprintImage);
    
    // Verify
    expect(result).to.be.true;
  });

  it('should fail to add students with invalid credentials', async function() {
    const studentNumber = 2419497;
    const name = "invalidName";
    const surname = "invalidSurname";
    const adminUserName = "admin1";
    const sessionId = sessionIdTest;
    const fingerprintImage = "odbpoXHFGIb7xWcu4ac7SQ==";

    // using nock library to stimulate server responses
    nock(serverIP)
      .post('/student/add', {studentNumber, name, surname, adminUserName, sessionId, fingerprintImage})
      .reply(404, { success: false });

    // Exercise
    const result = await sendDataForTesting(studentNumber, name, surname, adminUserName, sessionId, fingerprintImage);
    
    // Verify
    expect(result).to.be.false;
  });
})

// function getting from testaddLecture.js file
const { sendDataForTesting } = require('../Test Js Files/testaddLecture');

describe('Add Lecture Tests', () => {
  it('should add lecture successfully with valid credentials', async function() {
    const courseCode = 3550491;
    const department = "CNG";
    const name = "coursename";
    const adminUserName = "admin1";
    const sessionId = sessionIdTest;
    // using nock library to stimulate server responses
    nock(serverIP)
      .post('/course/add', {coursecode, department, coursename, adminUserName, sessionId})
      .reply(404, { success: true });

    // Exercise
    const result = await sendDataForTesting(coursecode, department, coursename, adminUserName, sessionId);
    
    // Verify
    expect(result).to.be.true;
  });

  it('should add lecture successfully with valid credentials', async function() {
    const courseCode = 123456;
    const department = "InvalidDepartment";
    const name = "InvalidName";
    const adminUserName = "admin1";
    const sessionId = sessionIdTest;
    // using nock library to stimulate server responses
    nock(serverIP)
      .post('/course/add', {coursecode, department, coursename, adminUserName, sessionId})
      .reply(404, { success: false });

    // Exercise
    const result = await sendDataForTesting(coursecode, department, coursename, adminUserName, sessionId);
    
    // Verify
    expect(result).to.be.false;
  });
})
describe('Add Instructor Tests', () => {
  it('server should connect successfully', async function() {
    // test here
  });
})

// function getting from testaddSection.js file
const { sendDataForTesting } = require('../Test Js Files/testaddSection');

describe('Add Sections Tests', () => {
  it('should add section successfully with valid credentials', async function() {
    const courseID = 3550491;
    const sectionYear = 2023;
    const sectionNumber = 1;
    const semester = "SPRING";
    const teacherUserName = "seraslan";
    const adminUserName = "admin1";
    const sessionId = sessionIdTest;
    // using nock library to stimulate server responses
    nock(serverIP)
      .post('/course/section/add', {courseID, sectionYear, sectionNumber, semester, teacherUserName, adminUserName, sessionId})
      .reply(404, { success: true });

    // Exercise
    const result = await sendDataForTesting(courseID, sectionYear, sectionNumber, semester, teacherUserName, adminUserName, sessionId);
    
    // Verify
    expect(result).to.be.true;
  });

  it('should fail to add section with invalid credentials', async function() {
    const courseID = 3550491;
    const sectionYear = 2023;
    const sectionNumber = 1;
    const semester = "invalidSemester";
    const teacherUserName = "invalidName";
    const adminUserName = "admin1";
    const sessionId = sessionIdTest;
    // using nock library to stimulate server responses
    nock(serverIP)
      .post('/course/section/add', {courseID, sectionYear, sectionNumber, semester, teacherUserName, adminUserName, sessionId})
      .reply(404, { success: false });

    // Exercise
    const result = await sendDataForTesting(courseID, sectionYear, sectionNumber, semester, teacherUserName, adminUserName, sessionId);
    
    // Verify
    expect(result).to.be.false;
  });
})
/*describe('Register Tests', () => {
  it('should add lecture successfully with valid credentials', async function() {
    const username = username;
    const password = password;
    const cpassword = cpassword;
    const fName = fName;
    const lName = lName;
    const email = email;

    // using nock library to stimulate server responses
    nock(serverIP)
      .post('/course/add', {coursecode, department, coursename, adminUserName, sessionId})
      .reply(404, { success: true });

    // Exercise
    const result = await sendDataForTesting(coursecode, department, coursename, adminUserName, sessionId);
    
    // Verify
    expect(result).to.be.true;
  });

  it('should add lecture successfully with valid credentials', async function() {
    const courseCode = 123456;
    const department = "InvalidDepartment";
    const name = "InvalidName";
    const adminUserName = "seraslan";
    const sessionId = sessionIdTest;
    // using nock library to stimulate server responses
    nock(serverIP)
      .post('/course/add', {coursecode, department, coursename, adminUserName, sessionId})
      .reply(404, { success: false });

    // Exercise
    const result = await sendDataForTesting(coursecode, department, coursename, adminUserName, sessionId);
    
    // Verify
    expect(result).to.be.false;
  });
})*/
describe('Attendance Page Tests', () => {
  it('server should connect successfully', async function() {
    // test here
  });
})