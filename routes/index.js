const express = require('express');
const router  = express.Router();

const User = require('../models/user');

// Find symbol name examples : http://eoddata.com/stocklist/NASDAQ.htm

/* GET home page */
router.get('/', (req, res, next) => {
  if (!req.session.currentUser){
    res.render('index')
  } else { 
    User.findOne({username: req.session.currentUser.username})
    .then(user => {
      res.render("index", {companies : user.companies, user: req.session.currentUser})
    })
    .catch(err => `Error : ${err}`)
  }
});

router.get('/add', (req, res, next) => {
  res.render('add-company', {user: req.session.currentUser});
});

router.post('/add', (req, res, next) => {
  const obj = JSON.parse(JSON.stringify(req.body))  
  User.findOneAndUpdate({username: req.session.currentUser.username}, { $push: {"companies": obj }})
  .then(() => {
    console.log("User modified !")
    res.redirect('/')
  })
  .catch(err => `Error : ${err}`)
});

router.get('/delete/:companyName', (req, res, next) => {C
  User.update( {'username': req.session.currentUser.username},{$pull:{"companies":{"name": req.params.companyName}}})
  .then(user => {
      console.log("Updated companies!", req.session.currentUser.companies)
      res.redirect('/')
    })
  .catch(err => `Error : ${err}`)
})
module.exports = router;