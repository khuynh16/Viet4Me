const express = require('express');

const Post = require('../models/post');

const router = express.Router();

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
  postQuery = Post.find();
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
