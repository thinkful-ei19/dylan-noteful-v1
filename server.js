'use strict';

const express = require('express');
const morgan = require('morgan');
const { PORT } = require('./config');
const notesRouter = require('./routers/notes-router');

const app = express();

app.use(morgan('dev'));

app.use(express.static('public'));
app.use(express.json());

app.use('/v1', notesRouter);

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

let server;

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err);
    });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        // so we don't also call `resolve()`
        return;
      }
      resolve();
    });
  });
}

// if (require.main === module) {
//   app.listen(PORT, function() {
//     console.info(`Server listening on ${this.address().port}`);
//   }).on('error', err => {
//     console.error(err);
//   });
// }

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };

