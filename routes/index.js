const express = require('express');
const router  = express.Router();

const Company = require('../models/company');

/* GET home page */
router.get('/', (req, res, next) => {
  Company.find()
  .then(companies => {
    res.render('index', {companies: companies, user: req.session.currentUser})
  })
  .catch(err => `Error : ${err}`)
});

router.get('/add', (req, res, next) => {
  res.render('add-company');
});

router.post('/add', (req, res, next) => {
  Company.create(req.body)
  .then(company => {
    console.log("Company added with success !")
    res.redirect('/')
  })
  .catch(err => `Error : ${err}`)
});

router.get('/delete/:id', (req, res, next) => {
  Company.findByIdAndDelete(req.params.id)
  .then((company) => {
    console.log(`${company.name} deleted!`)
    res.redirect('/')
  })
  .catch(err => `Error : ${err}`)
})

module.exports = router;