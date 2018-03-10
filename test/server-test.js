'use strict';

const { app, runServer, closeServer } = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });

});

describe('Noteful', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  describe('Express static', function() {
    it('GET request "/" should return the index page', function() {
      return chai.request(app)
        .get('/')
        .then(function(res) {
          expect(res).to.exist;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
        });
    });
  });
  
  describe('404 handler', function () {
  
    it('should respond with 404 when given a bad path', function () {
      return chai.request(app)
        .get('/bad/path')
        .catch(err => err.response)
        .then(res => {
          expect(res).to.have.status(404);
        });
    });
  
  });

  describe('GET /v1/notes', function() {
    it('should get list of all notes', function() {
      return chai.request(app)
        .get('/v1/notes')
        .then(function(res) {
          expect(res).to.exist;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body.length).to.be.at.least(10);

          const expectedKeys = ['id', 'title', 'content'];
          res.body.forEach(function(item) {
            expect(item).to.be.a('object');
            expect(item).to.include.keys(expectedKeys);
          });

        });
    });

    it('should return an empty array for an incorrect search', function() {
      return chai.request(app)
        .get('/v1/notes?searchTerm=This%20Will%20Not%20Be%20A%20Correct%20Search')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(0);
        });
    });

  });





});


