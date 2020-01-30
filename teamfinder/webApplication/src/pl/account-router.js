const express = require('express')
const expressHandlebars = require('express-handlebars')

const router = express.Router()

router.get('/login', function (request, response) {
  response.render("account-login.hbs")
})

router.post('/login', function (request, response) {
  response.redirect("/")
})

router.get('/sign-up', function (request, response) {
  response.render("account-sign-up.hbs")
})

router.get('/profile', function (request, response) {
  response.render("account-profile.hbs")
})

router.get('/edit', function(request, response){
  response.render("account-edit.hbs")
})

module.exports = router