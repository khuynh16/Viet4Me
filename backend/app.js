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
const userRoutes = require('./routes/user');

// express application to implement routing procedures
const app = express();

// connection to database
console.log(process.env.DB_URL); 
mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

// allow json data to be used and parsed
app.use(bodyParser.json());


// Serve only the static files form the dist directory
app.use(express.static('dist/Viet4Me'));

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
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);

app.get('/*', function(req,res) {
  res.sendFile(path.join('dist/Viet4Me/index.html'));
});

// exporting entire express app (which includes the middlewares)
module.exports = app;
