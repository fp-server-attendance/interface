const { expect } = require('chai');
const chai = require('chai');
// Chai HTTP provides an interface for live integration testing via superagent
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
var assert = chai.assert;
// using nock library to stimulate server responses
const nock = require('nock');
// functions in login.js
const { sendDataForTesting } = require('../login');
const { sendData } = require('../login');
const { getData } = require('../mainPage');

describe('Login Tests', () => {
  it('server should connect successfully', function (done) {
    chai.request('http://54.174.149.55:8080')
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
    nock('http://54.174.149.55:8080')
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

    nock('http://54.174.149.55:8080')
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

    nock('http://54.174.149.55:8080')
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
    chai.request('http://54.174.149.55:8080')
      .get('/')
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        done();
      });
  });
  it('should list courses successfully with valid credentials', async function() {
    const data = {
      sectionYear: '2023',
      semester: 'fall',
      teacherUserName: 'seraslan',
      sessionId: "c07f3e4f-9efe-4de2-abc0-40ecd84f4b74"
    };

    // using nock library to stimulate server responses
    nock('http://54.174.149.55:8080')
      .post('/teacher/courses', data)
      .reply(404, { success: true });

    // Exercise
    const result = await getData();

    // Verify
    expect(result).to.be.true;
  });

  it('should fail to list courses with invalid credentials', async function() {
    const data = {
      sectionYear: '2023',
      semester: 'fall',
      teacherUserName: 'wrongUserName',
      sessionId: "c07f3e4f-9efe-4de2-abc0-40ecd84f4b74"
    };

    // using nock library to stimulate server responses
    nock('http://54.174.149.55:8080')
      .post('/teacher/courses', data)
      .reply(404, { success: false });

    // Exercise
    const result = await getData();

    // Verify
    expect(result).to.be.false;
  });
});