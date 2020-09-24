const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const user = require('../models/user');

const router = express.Router();

/*
* Create new user for application and store in database.
*/
router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
      .then(result => {
        res.status(201).json({
          message: 'User created!',
          userId: user._id
        });
      })
      .catch(err => {
        res.status(500).json({
            message: 'Email is already registered to an account!'
        });
      });
    });
});

router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Email is not registered to an account (or wrong email)!'
        });
      }
      fetchedUser = user;
      // if code reaches this point, typed-in user exists
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Password does not match account!'
        });
      }
      // valid password sent by user
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        'secret_this_should_be_longer',
        { expiresIn: '1h' }
      );
      res.status(200).json({
        token: token,
        userId: fetchedUser._id,
        expiresIn: 3600
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Invalid authentication credentials!'
      });
    });
});

module.exports = router;
