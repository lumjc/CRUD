const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const {
  authenticatedOnly: authenticatedOnlyMiddleware,
  guestOnly: guestOnlyMiddleware,
} = require('../middleware/auth');


router.post( '/user/signup', guestOnlyMiddleware,
    [
      check('username', 'Please Enter a valid username')
          .exists()
          .not()
          .isEmpty(),
      check('email', 'Please enter a valid email').isEmail(),
      check('password', 'Please enter a valid password').isLength({
        min: 6,
      }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const alert = errors.array();
        res.render('user/signup', {
          alert: alert,
        });
      }
      const {
        username,
        email,
        password,
      } = req.body;
      try {
        let user = await User.findOne({
          email,
        });
        if (user) {
          res.redirect('/user/signup');
          return res.status(400).json({
            errorMessage: 'User Already Exists',
          });
        }

        user = new User({
          username,
          email,
          password,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
      } catch (err) {
        console.log(err);
        res.redirect('/user/signup');
      }
      res.redirect('/user/login');
    },
);

router.post(
    '/user/login', guestOnlyMiddleware,
    [
      check('email', 'Please enter a valid email').isEmail(),
      check('password', 'Please enter a valid password').isLength({
        min: 6,
      }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const alert = errors.array();
        res.render('user/login', {
          alert: alert,
        });
      }
      const {email, password} = req.body;
      try {
        const user = await User.findOne({
          email,
        });
        if (!user) {
          res.redirect('/user/login');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          res.redirect('/user/login');
        }

        req.session.user = user;
        res.redirect('/');
      } catch (err) {
        console.log(err);
        res.status(500).json({
          message: 'Server Error',
        });
      }
    },
);


router.get('/user/dashboard', authenticatedOnlyMiddleware, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const user = await User.findById(req.session.user._id);
    res.json(user);
  } catch (e) {
    res.send({message: 'Error in Fetching user'});
  }
});

router.get('/user/login', guestOnlyMiddleware, async (req, res) => {
  res.render('user/login');
});

router.get('/user/signup', guestOnlyMiddleware, async (req, res) => {
  res.render('user/signup', {message: req.flash('message')});
});


module.exports = router;
