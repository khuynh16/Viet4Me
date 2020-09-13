const express = require('express');

// implements backend post schema to use in adding new posts to database
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
  const pageSize = +req.query.pagesize;
  const currentPage = req.query.page;
  // let currentCheckedCategories = req.query.categories;
  const postQuery = Post.find();
  let fetchedPosts;

  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }

  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.countDocuments();

      // console.log('hello');
      // console.log('this is currentCheckedCats: ' + currentCheckedCategories);
      // console.log('====');

      // if (currentCheckedCategories !== 'undefined' && currentCheckedCategories !== undefined) {
      //   console.log('inside is: ' + currentCheckedCategories);
      //   console.log('End');
      //   console.log('second comment here!');
      //   console.log('This means checkbox has activated!');
      //   filteredPosts = [];
      //   documents.forEach(post => {
      //     console.log('length: ' + post.categories.length);
      //     for (let i = 0; i < post.categories.length - 1; i++) {
      //       // console.log(post.categories[i]);
      //       if (currentCheckedCategories.includes(post.categories[i]) && !filteredPosts.includes(post.categories[i])) {
      //         filteredPosts.push(post);
      //       }
      //     }
      //   });
      //   fetchedPosts = filteredPosts;
      //   return Post.countDocuments();
      // } else {
      //   console.log('Beginning and post list');
      //   fetchedPosts = documents;
      //   return Post.countDocuments();
      // }

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
  const currentPage = req.query.page;
  const filterCategories = req.query.filters;
  // let currentCheckedCategories = req.query.categories;
  const postQuery = Post.find();
  adjustPostsLength = 0;

  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }

  postQuery
    .then(documents => {

      console.log('filtersssss:' + filterCategories);
      filteredPosts = [];
      documents.forEach(post => {
        console.log('length: ' + post.categories.length);
        for (let i = 0; i < post.categories.length; i++) {
          console.log('Is ' + post.categories[i] + ' in ' + filterCategories + '?' + filterCategories.includes(post.categories[i]));
          if (filterCategories.includes(post.categories[i]) && !filteredPosts.includes(post.categories[i])) {
            filteredPosts.push(post);
          }
        }
      });
      // documents.forEach(post => {
      //   filteredPosts.push(post);
      // });
      adjustPostsLength = documents.length - filteredPosts.length;

      fetchedPosts = filteredPosts;
      return Post.countDocuments();

      // console.log('hello');
      // console.log('this is currentCheckedCats: ' + currentCheckedCategories);
      // console.log('====');

      // if (currentCheckedCategories !== 'undefined' && currentCheckedCategories !== undefined) {
      //   console.log('inside is: ' + currentCheckedCategories);
      //   console.log('End');
      //   console.log('second comment here!');
      //   console.log('This means checkbox has activated!');
      //   filteredPosts = [];
      //   documents.forEach(post => {
      //     console.log('length: ' + post.categories.length);
      //     for (let i = 0; i < post.categories.length - 1; i++) {
      //       // console.log(post.categories[i]);
      //       if (currentCheckedCategories.includes(post.categories[i]) && !filteredPosts.includes(post.categories[i])) {
      //         filteredPosts.push(post);
      //       }
      //     }
      //   });
      //   fetchedPosts = filteredPosts;
      //   return Post.countDocuments();
      // } else {
      //   console.log('Beginning and post list');
      //   fetchedPosts = documents;
      //   return Post.countDocuments();
      // }

    })
    .then(count => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: fetchedPosts,
        maxPosts: (count - adjustPostsLength)
      });
    });
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
