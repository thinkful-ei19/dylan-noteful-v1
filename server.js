'use strict';

const express = require('express');
const { PORT } = require('./config');

// TEMP: Simple In-Memory Database
const data = require('./db/notes');

const app = express();
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
  const searchTerm = req.query.searchTerm;
  searchTerm ? res.json(data.filter(item => item.title.includes(searchTerm))) : res.json(data);
});

app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const note = data.find(item => item.id === parseInt(id));
  res.json(note);
}); 


app.listen(PORT, function() {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});

// INSERT EXPRESS APP CODE HERE...
