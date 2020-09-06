/*
* requiring modules to make working with Node.js easier
* express: calling requests and handling responses
* body-parser: parsing incoming requests, with help of 'req.body'
* mongoose: connecting to the backend (MongoDB and MongoDB Atlas)
*/
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postRoutes = require('./routes/posts');

// express application to implement routing procedures
const app = express();

// import credential variable to connect to database
const DB_CREDENTIALS = require('../config');

// connection to database
mongoose.connect(DB_CREDENTIALS.DB_URL)
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

// allow json data to be used and parsed
app.use(bodyParser.json());

/*
* cross-origin resource sharing (CORS) between different domains
* 'Access-Control-Allow-Origin': response header indicates whether the response
*   can be shared with requesting code from the given origin
* 'Access-Control-Allow-Headers': used in response to a preflight request which includes
*   the Access-Control-Request-Headers to indicate which HTTP headers can be used during
    the actual request.
* 'Access-Control-Allow-Methods': specifies which methods are allowed when accessing resource
*/
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader('Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

app.use('/api/posts', postRoutes);

// exporting entire express app (which includes the middlewares)
module.exports = app;
