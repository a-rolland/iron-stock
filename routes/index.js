const express = require('express');
const router  = express.Router();

const Company = require('../models/company');
const User = require('../models/user');

// Find symbol name examples : http://eoddata.com/stocklist/NASDAQ.htm

/* GET home page */
router.get('/', (req, res, next) => {
  // Company.find()
  // .then(companies => {
  //   res.render('index', {companies: companies, user: req.session.currentUser})
  // })
  User.findOne(req.session.currentUser)
  .then(user => {
    res.render("index", {companies : user.companies, user: req.session.currentUser})
  })
  .catch(err => `Error : ${err}`)
});

router.get('/add', (req, res, next) => {
  res.render('add-company', {user: req.session.currentUser});
});

router.post('/add', (req, res, next) => {
  // Company.create(req.body)
  // .then(company => {
  //   console.log("Company added with success !")
  //   res.redirect('/')
  // })
  const obj = JSON.parse(JSON.stringify(req.body))  
  User.findOneAndUpdate(req.session.currentUser, { $push: {"companies": obj }})
  .then(() => {
    console.log("User modified !")
    res.redirect('/')
  })
  .catch(err => `Error : ${err}`)
});

router.get('/delete/:companyName', (req, res, next) => {
  Company.findByIdAndDelete(req.params.id)
  .then((company) => {
    console.log(`${company.name} deleted!`)
    res.redirect('/')
  })
//   db.survey.update( // select your doc in moongo
//     { }, // your query, usually match by _id
//     { $pull: { results: { $elemMatch: { score: 8 , item: "B" } } } }, // item(s) to match from array you want to pull/remove
//     { multi: true } // set this to true if you want to remove multiple elements.
// )

  // User.findOneAndUpdate(req.session.currentUser, {$pull: {companies: { $elemMatch: { name: req.params.companyName} }}})
  // .then(user => {
  //   console.log("Deleted ", user)
  //   res.redirect("/")
  // })
  .catch(err => `Error : ${err}`)
})

module.exports = router;


// doc.subdocs.pull({ _id: 4815162342 }) // removed
