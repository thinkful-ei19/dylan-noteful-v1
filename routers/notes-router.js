'use strict';
const express = require('express');
const router = express.Router();

// TEMP: Simple In-Memory Database
const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

router.get('/notes', (req, res, next) => {
  const { searchTerm } = req.query;
  notes.filter(searchTerm, (err, list) => {
    if (err) return next(err);
    res.json(list);
  });
});

router.get('/notes/:id', (req, res, next) => {
  const { id } = req.params;
  notes.find(id, (err, item) => {
    if (err) return next(err);
    item ? res.json(item) : next();
  });
}); 

router.put('/notes/:id', (req, res, next) => {
  const { id } = req.params;

  const updateObj = {};
  const updateFields = ['title', 'content'];

  console.log(req.body);

  updateFields.forEach(field => {
    if (field in req.body) updateObj[field] = req.body[field];
  });

  notes.update(id, updateObj, (err, item) => {
    if (err) return next(err);
    item ? res.json(item) : next();
  });

});

router.post('/notes', (req, res, next) => {
  const { title, content } = req.body;
  const newItem = { title, content };

  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  notes.create(newItem, (err, item) => {
    if (err) return next(err);
    item ? res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item) : next();
  });

});

router.delete('/notes/:id', (req, res, next) => {
  const { id } = req.params;

  notes.delete(id, (err, item) => {
    if (err) return next(err);
    item ? res.status(204).end() : next();
  });
});

module.exports = router;

