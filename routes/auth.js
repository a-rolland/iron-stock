const express = require('express');
const router  = express.Router();
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');

const saltRound = 10; 

const User = require('../models/user');
const user = require('../models/user');

/* GET home page */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup')
});

router.post('/signup', (req, res, next) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    res.status(500).render('auth/signup', { 
      errorMessage: 'Fields must NOT be empty'   
    });
    return;
  }
  
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render('auth/signup', { 
      errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' 
    });
    return;
  }

  bcryptjs.genSalt(saltRound)
  .then(salt => bcryptjs.hash(password,salt))
  .then(hashedPassword => {
    User.create({
      username: username,
      email: email,
      passwordHash: hashedPassword
    })
    .then(user => {
      req.session.currentUser = user;
      res.redirect('/')
    })
    .catch(error => {
      // Wrong mail
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).render('auth/signup', {
            errorMessage: error.message
        })
      // User already exists
      } else if (error.code === 11000) {
        res.status(400).render('auth/signup', {
          errorMessage: "This username already exists"
        })
      } else {
        console.log(error)
      }
    })
  })
  .catch(err => next(err))
});

router.get('/login', (req, res, next) => {
  res.render('auth/login')
});

router.post('/login', (req, res, next) => {
  const {email, password} = req.body;

  if (!email || !password) {
    res.status(500).render('auth/signup', { 
      errorMessage: 'Fields must NOT be empty'   
    });
    return;
  }
  
  User.findOne({email})
    .then(user => {
      if (!user) {
        res.render('auth/login', { errorMessage: "Try another mail" })
        return
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect('/')
      } else {
        res.render('auth/login', { errorMessage: "Wrong password" })
        return
      }
    })
    .catch (err => next(err))
})

router.post('/logout', (req, res) => {
  if (req.session.currentUser) {
    req.session.destroy();
    res.redirect('/');
  }
});


module.exports = router;