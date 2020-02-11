const express = require('express')
const expressHandlebars = require('express-handlebars')
const router = express.Router()
const messageManager = require('../bll/message-manager')
const accountManager = require('../bll/account-manager')


router.post('/create', function(request, response){

    console.log("message create reached")

    const groupId = request.body.groupId
    const accountId = request.session.accountId
    const text = request.body.text


    accountManager.getAccountById(accountId, function(error, account){

        if(error){
            const model = {
                error
            }
            response.render("group-specific.hbs", model)
        }

        else{

            const authorName = account.FirstName + ' ' + account.LastName
            
            const message = {
                groupId,
                accountId,
                text,
                authorName
            }
            
            messageManager.createMessage(message, function(error){

                console.log("i callback efter create message")

                if(error){
                    console.log("hamnade i error ändå ...")
            
                    model = {
                    error
                    }            
                }
                else{
                console.log("esle i callback")
                response.redirect("../groups/" + groupId )
                }

            })
        }
    })
})




module.exports = router