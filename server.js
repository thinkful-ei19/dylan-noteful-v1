'use strict';

const express = require('express');
const { PORT } = require('./config');
const morgan = require('morgan');

// TEMP: Simple In-Memory Database
const data = require('./db/notes');

const app = express();

app.use(morgan('common'));

app.use(express.static('public'));

app.get('/boom', (req, res, next) => {
  throw new Error('Boom!');
});

app.get('/api/notes', (req, res) => {
  const searchTerm = req.query.searchTerm;
  searchTerm ? res.json(data.filter(item => item.title.includes(searchTerm))) : res.json(data);
});

app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const note = data.find(item => item.id === parseInt(id));
  res.json(note);
}); 

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({message: 'Not Found'});
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
