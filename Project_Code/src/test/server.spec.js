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
  // TO-DO: Part A Login unit test case/ Part B Register unit test case

  it('positive: /login', done => {
    chai.request(server)
      .post('/login')
      .send({ username: 'alnaik', password: '123' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal('Success');
        expect(res.body.message).to.equal('Login Successful');
        done();
      });
  });
  

  it('Negative: /login with invalid password', done => {
    chai.request(server)
      .post('/login')
      .send({ username: 'alnaik', password: 'lalalala' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal('error');
        expect(res.body.message).to.equal('Incorrect Username or Password');
        expect(res.body).to.not.have.property('user');
        done();
      });
  });

  it('positive: /register', done => {
    chai.request(server)
      .post('/register')
      .send({ username: 'test4', password: 'pass4' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal('Success');
        expect(res.body.message).to.equal('Registration Successful');
        done();
      });
  });

  it('negative: /register (duplicate user)', done => {
    chai.request(server)
      .post('/register')
      .send({ username: 'test1', password: 'pass1' }) // The same user as in the positive test case
      .end((err, res) => {
        expect(res).to.have.status(409); // Conflict status code
        expect(res.body.status).to.equal('Error');
        expect(res.body.message).to.equal('Username already exists');
        done();
      });
  });
  
});