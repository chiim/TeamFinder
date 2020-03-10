const express = require('express')

module.exports = function ({ accountManager, middleware }) {

    const isAuthorized = middleware.isAuthorized

    const router = express.Router()

    router.get('/login', function (request, response) {
        const unAuthorized = request.query.unAuthorized//this is undefined if not existing
        if (unAuthorized) {
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

        accountManager.loginAccount(email, password, function (error, account) {

            if (error) {
                const model = {
                    email,
                    error,
                    csrfToken: request.csrfToken()
                }
                response.render('account-login.hbs', model)
            }
            else {
                request.session.accountId = account.accountId // Remove when the other things are fixed.
                response.redirect('/')
            }
            //sessionManager.getSessionId(account.accountId, function(error, sessionId){
            //request.sessionID = sessionId

            //}) 
        })
    })


    router.get('/Logout', function (request, response) {
        request.session.accountId = null
        request.session.destroy(function (error) { // Use when database works
            if (error) {
                response.redirect('/?error=true')
            }
            else {
                response.redirect('/')
            }
        })
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
                const success = "You successfully created an account! Please log in"
                const model = {
                    success,
                    csrfToken: request.csrfToken()
                }
                response.render('account-sign-up.hbs', model)
            }
        })
    })


    //här får bara ägaren ändra kontot..
    router.get('/edit', isAuthorized, function (request, response) {

        const accountId = request.session.accountId

        accountManager.getAccountById(accountId, function (errors, account) {

            if(errors){
                const model = {
                    errors,
                    csrfToken: request.csrfToken()
                }
                response.render("account-edit.hbs", model)
            }
            else{
                const model = {
                    account,
                    csrfToken: request.csrfToken()
                }
                response.render("account-edit.hbs", model)
            }
            
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
        const account = {
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



    router.get('/:id', isAuthorized, function (request, response) {

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

        accountManager.deleteAccount(accountId, function (error) {

            if (error) {
                model = {
                    error,
                    csrfToken: request.csrfToken()
                }
                response.render("account-profile.hbs", model)
            }
            else {
                response.redirect("/accounts/logout")
            }
        })

    })
    return router
}
