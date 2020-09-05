/*
* requiring modules to make working with Node.js easier
* express: calling requests and handling responses
* body-parser: parsing incoming requests, with help of 'req.body'
* mongoose: connecting to the backend (MongoDB and MongoDB Atlas)
*/
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// implements backend post schema to use in adding new posts to database
const Post = require('./models/post');

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
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

/*
* adding posts to database
* -creates a post with request values
* -saves document into database via .save() (mongoose function)
* -displays a message to console after successful (201 code) creation
*/
app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    engTranslation: req.body.engTranslation,
    vietTranslation: req.body.vietTranslation,
    categories: req.body.categories
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: createdPost._id
    });
  });

});

/*
* retrieving all posts from database
* - mongoose .find() function to retrieve posts and send back a message and posts itself
*/
app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: documents
      });
    });
});

/*
// dynamic passed segment (:id)
req.params: express function that gives access to encoded
parameters
*/

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Post deleted!' });
  })
});

// exporting entire express app (which includes the middlewares)
module.exports = app;
