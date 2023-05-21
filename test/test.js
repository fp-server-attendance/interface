const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
// using nock library to stimulate server responses
const nock = require('nock');
const { sendDataForTesting } = require('../login');

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
    nock('http://seraslan:8080')
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
});
