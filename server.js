'use strict';

const express = require('express');
const { PORT } = require('./config');
const logger = require('./middleware/logger');

// const morgan = require('morgan');

// TEMP: Simple In-Memory Database
const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);

const app = express();

// app.use(morgan('common'));

app.use(logger);

app.use(express.static('public'));
app.use(express.json());

app.get('/boom', (req, res, next) => {
  throw new Error('Boom!');
});

app.get('/api/notes', (req, res, next) => {
  const { searchTerm } = req.query;
  notes.filter(searchTerm, (err, list) => {
    if (err) return next(err);
    res.json(list);
  });
});

app.get('/api/notes/:id', (req, res, next) => {
  const { id } = req.params;
  notes.find(id, (err, item) => {
    if (err) return next(err);
    item ? res.json(item) : next();
  });
}); 

app.put('/api/notes/:id', (req, res, next) => {
  const { id } = req.params;

  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) updateObj[field] = req.body[field];
  });

  notes.update(id, updateObj, (err, item) => {
    if (err) return next(err);
    item ? res.json(item) : next();
  });

});

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});


app.listen(PORT, function() {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});

// INSERT EXPRESS APP CODE HERE...
