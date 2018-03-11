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

  describe('GET /v1/notes/:id', function() {

    it('should return the correct note', function() {
      return chai.request(app)
        .get('/v1/notes/1001')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.id).to.equal(1001);
        });
    });

    it('should return a 404 page not found', function() {
      return chai.request(app)
        .get('/v1/notes/2001')
        .catch(function(err) {
          return err.response;
        })
        .then(function(res) {
          expect(res).to.have.status(404);
        });
    });

  });

  describe('POST /v1/notes', function() {
    it('should create a new note and return the new data if valid', function() {

      const newData = {
        'title': 'This is testing title',
        'content': 'This is testing content'
      };

      return chai.request(app)
        .post('/v1/notes')
        .send(newData)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('id', 'title', 'content');
          expect(res.body.title).to.equal('This is testing title');
          expect(res.body.content).to.equal('This is testing content');
        });
        
    });

    it('should return an error with invalid POST data', function() {
      
      const newData = {
        'false': 'this is incorrect and invalid'
      };

      return chai.request(app)
        .post('/v1/notes')
        .send(newData)
        .catch(function(err) {
          return err.response;
        })
        .then(function(res) {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body.message).to.equal('Missing `title` in request body');
        });

    }); 

  });

  describe('DELETE /v1/notes/:id', function () {

    it('should delete an item by id', function () {
      return chai.request(app)
        .delete('/v1/notes/1005')
        .then(function (res) {
          expect(res).to.have.status(204);
        });
    });

    it('should respond with a 404 for an invalid id', function () {
      return chai.request(app)
        .delete('/v1/notes/9999')
        .catch(err => err.response)
        .then(res => {
          expect(res).to.have.status(404);
        });
    });
  });

});



});


