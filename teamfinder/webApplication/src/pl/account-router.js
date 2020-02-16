const express = require('express')
const expressHandlebars = require('express-handlebars')
const accountManager = require('../bll/account-manager')
const middleware = require('../pl/middleware-router')

//var login = middleware.isAuthorized o kalla på login istället

const router = express.Router()




router.get('/login', function (request, response) {

    const unAuthorized = request.query.unAuthorized//this is undefined if not existing
    if(unAuthorized){
        const printErrorMessage = "You must login before accessing that page."
        const model = {
            printErrorMessage,
            csrfToken: request.csrfToken()
        }
        response.render("account-login.hbs", model)
    }
    else {
        const model = {
            csrfToken: request.csrfToken()
        }
        response.render("account-login.hbs", model)
    }

})

router.post('/login', function (request, response) {
    const email = request.body.email
    const password = request.body.password

    const credentials = {
        email,
        password
    }

    accountManager.loginAccount(credentials, function (error, account) {

        if (error) {
            const model = {
                email,
                password,
                error,
                csrfToken: request.csrfToken()
            }
            response.render('account-login.hbs', model)
        }
        else {
            //sessionManager.getSessionId(account.AccountId, function(error, sessionId){
            //request.sessionID = sessionId
            request.session.accountId = account.AccountId // Remove when the other things are fixed.
            response.redirect('/')
            //}) 
        }
    })
})


router.get('/Logout', function (request, response) {
    request.session.accountId = null
    //request.session.destroy({ // Use when database works
    response.redirect("/")
        //})
})


router.get('/sign-up', function (request, response) {
    const model = {
        csrfToken: request.csrfToken()
    }
    response.render("account-sign-up.hbs", model)
})

router.post('/sign-up', function (request, response) {

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

    accountManager.createAccount(account, function (error) {

        if (error) {
            model = {
                error,
                account,
                csrfToken: request.csrfToken()
            }
            response.render("account-sign-up.hbs", model)
        }
        else {
            //const sessionId = request.sessionID
            //sessionManager.insertSessionId(account.accountId, sessionId, function(error){
                response.redirect("/")
            //})
        }
    })
})


//här får bara ägaren ändra kontot..
router.get('/edit', middleware.isAuthorized, function (request, response) {

    const accountId = request.session.accountId

    accountManager.getAccountById(accountId, function (errors, account) {

        const model = {
            errors,
            account,
            csrfToken: request.csrfToken()
        }
        response.render("account-edit.hbs", model)
    })
})

router.post('/edit', function (request, response) {

    const firstName = request.body.firstName
    const lastName = request.body.lastName
    const email = request.body.email
    const password = request.body.password
    const age = request.body.age
    const city = request.body.city
    const gender = request.body.gender
    const accountId = request.session.accountId
    account = {
        accountId,
        firstName,
        lastName,
        email,
        password,
        age,
        city,
        gender
    }
    accountManager.updateAccount(account, function (errors) {

        if (errors) {
            const model = {
                errors,
                csrfToken: request.csrfToken()
            }
            response.render("account-edit.hbs", model)
        }
        else {
            response.redirect("/accounts/" + accountId)
        }
    })

})



router.get('/:id', middleware.isAuthorized, function (request, response) {

    const accountId = request.params.id

    accountManager.getAccountById(accountId, function (errors, account) {

        if (errors) {
            const model = {
                errors,
                csrfToken: request.csrfToken()
            }
            response.render('account-profile.hbs', model)
        }

        const model = {
            account,
            csrfToken: request.csrfToken()
        }
        response.render("account-profile.hbs", model)
    })

})

router.post('/editId', function (request, response) {
    response.redirect('/accounts/edit')
})


router.post('/delete', function (request, response) {


    const accountId = request.session.accountId

    accountManager.deleteAccount(accountId, function(error){

        if(error){
            console.log("delete account lyckades inte... i callback")
            model = {
                error,
                csrfToken: request.csrfToken()
            }
            response.render("account-profile.hbs", model)
        }
        else{
            response.redirect("/accounts/logout")
        }
    })

})

module.exports = router