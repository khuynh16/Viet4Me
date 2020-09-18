const express = require('express');

// implements backend post schema to use in adding new posts to database
const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');

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
    categories: req.body.categories
  });
  Post.updateOne({_id: req.params.id}, post).then(result => {
    res.status(200).json({message: 'Update successful!'});
  });
});

/*
* Retrieve all posts in database.
* @param '' the path after the already defined /api/posts route, defined in app.js
* @param (req, res, next) express middleware
* @return posts in database and number of posts (depending on pagination options)
*/
router.get('', (req, res, next) => {
  // const textFilter = req.query.userfilter;
  // console.log('TExtfilter: ' + textFilter);
  // const filteredCategoriesArray = req.query.filters.toString().split(',');
  // console.log(filteredCategoriesArray);
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;

  // postQuery = Post.find(
  //   {engTranslation: new RegExp(textFilter, 'i')},
  //   { categories: { $elemMatch: { $in: filteredCategoriesArray }}}
  //   );
  postQuery = Post.find();
  // if (textFilter !== '') {
  //   // finds all posts that match user inputed text filter (insensitive to case)
  //   postQuery = Post.find({engTranslation: new RegExp(textFilter, 'i')});
  // }
  // else {
  //   postQuery = Post.find();
  // }
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  postQuery.then(posts => {
    adjustedPostsLength = posts.length;
    console.log("ADJUSTED2: " + adjustedPostsLength);
  })

  postQuery
    .then(documents => {
      console.log('DOCS HERE');
      console.log(documents);
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

// THE SECOND ONE
router.get('/categories', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const userfilter = req.query.userfilter;
  const filteredCategoriesArray = req.query.categoryfilter.toString().split(',');
  const currentLanguage = req.query.language;
  console.log('userfilter: ' + userfilter);
  console.log('category filter: ' + filteredCategoriesArray);
  console.log('language: ' + currentLanguage);

  if (userfilter === 'undefined' || userfilter === '') {
    console.log('no input');
    postQuery = Post.find(
      { "categories": { $elemMatch: { $in: filteredCategoriesArray}}}
    );
    // postQuery.limit(pageSize);

  } else if (currentLanguage === 'ENG') {
    console.log('ENG check');
    postQuery = Post.find(

      // { engTranslation: new RegExp(userfilter, 'i')},
      { "engTranslation": new RegExp(userfilter, 'i'), "categories": { $elemMatch: { $in: filteredCategoriesArray }}}
    );
  } else if (currentLanguage === 'VIET') {
    postQuery = Post.find(
    { "vietTranslation": new RegExp(userfilter, 'i'), "categories": { $elemMatch: { $in: filteredCategoriesArray }}}
    );
  }

  console.log('page size and current Page: ' + pageSize + ', ' + currentPage);
  // if (pageSize && currentPage) {
  // postQuery
  //     .skip(pageSize * (currentPage - 1))
  //     .limit(pageSize);
  // }

  postQuery.then(posts => {
    console.log("length after filters: " + posts.length);
    templength = posts.length;
  })

  postQuery
    .then(documents => {
      console.log('DOCUMENTS: ' + documents);

      fetchedPosts = documents;
      return postQuery.countDocuments();
    })
    .then(count => {
      console.log("COUNTTS: " + count);
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: fetchedPosts,
        maxPosts: count
      });
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
});

module.exports = router;
