// will hold the express app
const express = require('express');

// returns express application
// express app: a big chain of middlewares we apply to requests
const app = express();

app.use('/api/posts', (req, res, next) => {
  res.send('hello!');
});


// exporting entire express app (which includes the middlewares)
module.exports = app;

// Continue on lecture 38: 2:33
