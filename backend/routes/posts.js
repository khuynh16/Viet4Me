const express = require('express');

// implements backend post schema to use in adding new posts to database
const Post = require('../models/post');

const router = express.Router();

/*
* adding posts to database
* -creates a post with request values
* -saves document into database via .save() (mongoose function)
* -displays a message to console after successful (201 code) creation
*/
router.post('', (req, res, next) => {
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

router.put('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    engTranslation: req.body.engTranslation,
    vietTranslation: req.body.vietTranslation,
    categories: req.body.categories
  });
  Post.updateOne({_id: req.params.id}, post).then(result => {
    res.status(200).json({message: 'Update successful!'});
  });
});

/*
* retrieving all posts from database
* - mongoose .find() function to retrieve posts and send back a message and posts itself
*/
router.get('', (req, res, next) => {
  // extract query parameters (if any)
  const pageSize = +req.query.pagesize;
  const currentPage = req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: fetchedPosts,
        maxPosts: count
      });
    });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  })
});

/*
// dynamic passed segment (:id)
req.params: express function that gives access to encoded
parameters
*/
router.delete('/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Post deleted!' });
  })
});

module.exports = router;
