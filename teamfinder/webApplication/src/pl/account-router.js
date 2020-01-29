const express = require('express')
const expressHandlebars = require('express-handlebars')

const router = express.Router()

router.get('/login', function (request, response) {
  response.render("login.hbs")
})

router.post('/login', function (request, response) {
  response.redirect("/")
})

router.get('/register', function (request, response) {
  response.render("register.hbs")
})

module.exports = router