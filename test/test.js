const { expect } = require('chai');
const chai = require('chai');
// Chai HTTP provides an interface for live integration testing via superagent
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
var assert = chai.assert;
// using nock library to stimulate server responses
const nock = require('nock');
// functions in login.js
const { sendDataForTesting } = require('../testLogin');
const { sendData } = require('../testLogin');
// functions in mainPage.js
const { getData } = require('../testMainPage');
const { getDataForTesting } = require('../testMainPage');


const sessionIdTest = "";
describe('Login Tests', () => {
  it('server should connect successfully', function (done) {
    chai.request('http://3.226.237.9:8080')
      .get('/')
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        done();
      }); 
  });
  it('should login successfully with valid credentials', async function() {

    const username = 'seraslan';
    const password = 'abc123';
    // using nock library to stimulate server responses
    nock('http://3.226.237.9:8080')
      .post('/teacher/authenticate', { username, password })
      .reply(404, { success: true });
    
    // Exercise
    const result = await sendDataForTesting(username, password);
    // Verify
    expect(result).to.be.true;
  });

  it('should fail to login with invalid credentials', async function() {
    // Setup
    const username = 'wrongUsername';
    const password = 'wrongPassword';

    nock('http://3.226.237.9:8080')
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

    nock('http://3.226.237.9:8080')
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
  it('server should connect successfully', function (done) {
    chai.request('http://3.226.237.9:8080')
      .get('/')
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        done();
      }); 
  });
  it('should list courses successfully with valid credentials', async function() {
    const sectionYear = '2023';
    const semester = 'SPRING';
    const teacherUserName = 'seraslan';
    const sessionId = "4ed0f6ca-31ef-41c3-9e57-fac3b9a8297e";

    // using nock library to stimulate server responses
    nock('http://3.226.237.9:8080')
      .post('/teacher/courses', {sectionYear, semester, teacherUserName, sessionId})
      .reply(404, { success: true });

    // Exercise
    const result = await getDataForTesting();
    
    // Verify
    expect(result).to.be.true;
  });

  it('should fail to list courses with invalid credentials', async function() {
    const sectionYear = '2023';
    const semester = 'fall';
    const teacherUserName = 'seraslan';
    const sessionId = "c07f3e4f-9efe-4de2-abc0-40ecd84f4b74";

    // using nock library to stimulate server responses
    nock('http://3.226.237.9:8080')
      .post('/teacher/courses', {sectionYear, semester, teacherUserName, sessionId})
      .reply(404, { success: false });

    // Exercise
    const result = await getDataForTesting();

    // Verify
    expect(result).to.be.false;
  });
});