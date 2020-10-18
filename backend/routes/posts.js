const express = require('express');

// implements backend post schema to use in adding new posts to database
const Post = require('../models/post');
// const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const fs = require('fs');

/*
* Adds new post to database.
* @param '' the path after the already defined /api/posts route, defined in app.js
* @param (req, res, next) express middleware
* @return saved post and json object of message and new post id
*/
router.post('', (req, res, next) => {
  const post = new Post({
    engTranslation: req.body.engTranslation,
    vietTranslation: req.body.vietTranslation,
    categories: req.body.categories,
    creator: req.body.creator
  });
  post.save().then(createdPost => {

    // create the audio mp3 file here
    const stringFile = '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';
     fs.writeFileSync('src/assets/audio/newstuff.mp3', Buffer.from(stringFile, 'base64'));


    res.status(201).json({
      message: 'Post added successfully',
      postId: createdPost._id
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Creating a post failed!'
    });
  });
});

/*
* Edits post in database.
* @param '/:id' id of post
* @param (req, res, next) express middleware
* @return update to one post and message
*/
router.put('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    engTranslation: req.body.engTranslation,
    vietTranslation: req.body.vietTranslation,
    categories: req.body.categories,
    creator: req.body.creator
  });
  Post.updateOne({_id: req.params.id}, post).then(result => {
    res.status(200).json({message: 'Update successful!'});
  })
  .catch(error => {
    res.status(500).json({
      message: 'Could not update post!'
    })
  });
});

/*
* Retrieve all posts in database.
* @param '' the path after the already defined /api/posts route, defined in app.js
* @param (req, res, next) express middleware
* @return posts in database and number of posts (depending on pagination options)
*/
router.get('', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;

  postQuery = Post.find();

  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: fetchedPosts,
        maxPosts: count
      });
    });
});

/*
* Get posts based on certain categories from database.
* @param '/categories' the path after /api/posts, defined in app.js
* @param (req, res, next) express middleware for requests, response, and next
* @return posts from database that matches the certain filtered categories 
*/

router.get('/categories', (req, res, next) => {
  const userfilter = req.query.userfilter;
  const filteredCategoriesArray = req.query.categoryfilter.toString().split(',');
  const currentLanguage = req.query.language;

  if (userfilter === 'undefined' || userfilter === '') {
    postQuery = Post.find(
      { "categories": { $elemMatch: { $in: filteredCategoriesArray}}}
    );
  } else if (currentLanguage === 'ENG') {
    postQuery = Post.find(
      { "engTranslation": new RegExp(userfilter, 'i'), "categories": { $elemMatch: { $in: filteredCategoriesArray }}}
    );
  } else if (currentLanguage === 'VIET') {
    postQuery = Post.find(
    { "vietTranslation": new RegExp(userfilter, 'i'), "categories": { $elemMatch: { $in: filteredCategoriesArray }}}
    );
  }

  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return postQuery.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching filtered posts failed!'
      })
    })
});

/*
* Get post by specified id.
* @param '/:id' the post's id
* @param (req, res, next) express middleware
* @return post with the identified id
*/
router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Retrieving specific post failed!'
    })
  })
});

/*
* Delete a post associated with a specific id.
* @param '/:id' specific post id
* @(req, res, next) express middleware
* @return deleted post from databaes and success message
*/
router.delete('/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Post deleted!' });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Deleting specific post failed!'
    })
  })
});

module.exports = router;
