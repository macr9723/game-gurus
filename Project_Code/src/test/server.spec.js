// Imports the index.js file to be tested.
const server = require('../index'); //TO-DO Make sure the path to your index.js is correctly added
// Importing libraries

// Chai HTTP provides an interface for live integration testing of the API's.
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });

  // ===========================================================================
  // TO-DO: Part A Login unit test case

  it('positive : /login', done => {
    chai.request(server)
      .post('/login')
      .send({ username: 'alnaik', password: '123' })
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.have.property('password');
        expect(res.body.user).to.have.property('username', 'alnaik');
        done();
      });
  });

  it('Negative: /login with invalid password', done => {
    chai.request(server)
      .post('/login')
      .send({ username: 'existinguser', password: 'invalid-password' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.equal('error');
        expect(res.body.message).to.equal('Invalid username or password');
        expect(res.body).to.not.have.property('user');
        done();
      });
  });
});