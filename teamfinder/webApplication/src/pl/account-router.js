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

    console.log("test")
    console.log(request.body.firstName)
    const firstName = request.body.firstName
    const lastName = request.body.lastName
    const email = request.body.email
    const password = request.body.password
    const age = request.body.age
    const city = request.body.city    
    const gender = request.body.gender
    account = {
        firstName,
        lastName,
        email,
        password,
        age,
        city,        
        gender
    }
    accountManager.createAccount(account, function (error, account) {
        
        console.log(error, account.id)
        if (error) {                     
            model = {
                error
            }
            response.render("account-sign-up.hbs", model)
        }
        else {
            response.redirect("/")
        }

    })

})

/*
router.get('/profile', function (request, response) {
    response.render("account-profile.hbs")
})
*/

router.get('/edit', function (request, response) {
    response.render("account-edit.hbs")
})

router.get('/:id', function(request, response){
    
    console.log(request.params.id)
	const accountId = request.params.id
	
	accountManager.getAccountById(accountId, function(errors, account){
        console.log(errors, account)
        const model = {
			errors,
			account
		}
		response.render("account-profile.hbs", model)
	})
    
    
})

module.exports = router