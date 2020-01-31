const express = require('express')
const expressHandlebars = require('express-handlebars')
const accountManager = require('../bll/account-manager')

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

router.post('/sign-up', function (request, response) {

    const firstName = request.body.firstName
    const lastName = request.body.lastName
    const email = request.body.email
    const age = request.body.age
    const city = request.body.city
    const phoneNr = request.body.phoneNr
    const password = request.body.password
    account = {
        firstName,
        lastName,
        email,
        age,
        city,
        phoneNr,
        password
    }
    accountManager.createAccount(account, function (error, account) {
        
        if (error) {            
            model = {
                error
            }
            response.render("sign-up.hbs", model)
        }
        else {
            response.redirect("/")
        }

    })

})

router.get('/profile', function (request, response) {
    response.render("account-profile.hbs")
})

router.get('/edit', function (request, response) {
    response.render("account-edit.hbs")
})

module.exports = router