const express = require('express')
const expressHandlebars = require('express-handlebars')
const accountManager = require('../bll/account-manager')

const router = express.Router()

router.get('/login', function (request, response) {
    response.render("account-login.hbs")
})

router.post('/login', function (request, response) {

    const email = request.body.email
    const password = request.body.password

    const credentials = {
        email,
        password
    }

    accountManager.loginAccount(credentials, function(error, account){

        if(error){
            const model = {
                email,
                password,
                error
            }
            response.render('account-login.hbs', model)
        }
        else{
            request.session.accountId = account.AccountId
            response.redirect('/')
            
        }
    })
})


router.get('/Logout', function (request, response) {
    request.session.accountId = null
    response.redirect("/")
})


router.get('/sign-up', function (request, response) {
    response.render("account-sign-up.hbs")
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
                account
            }
            response.render("account-sign-up.hbs", model)
        }
        else {
            response.redirect("/")
        }

    })

})



router.get('/edit/', function (request, response) {
    
	const accountId = request.session.accountId
	
	accountManager.getAccountById(accountId, function(errors, account){

        const model = {
			errors,
			account
		}
		response.render("account-edit.hbs", model)
	})   
})

router.post('/edit', function(request, response){

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
    accountManager.updateAccount(account, function(errors){

        if(error){
            const model = {
                error
            }
            response.redirect("accounts/edit/" + accountId )
        }
        else{
            response.redirect("/accounts/" + accountId )
        }
    })

})

router.get('/:id', function(request, response){
    
	const accountId = request.params.id
	
	accountManager.getAccountById(accountId, function(errors, account){

        const model = {
			errors,
			account
		}
		response.render("account-profile.hbs", model)
	})    
    
})

router.post('/delete', function(request, response){

    console.log("kom in i post /delete")

    const accountId = request.session.accountId

    console.log(accountId)

    accountManager.deleteAccount(accountId, function(error){

        console.log("i callbacken")
        if(error){
            model = {
                error
            }
            response.render("account-profile.hbs", model)
        }
        else{
            response.redirect("/logout")
        }
    })

})

module.exports = router