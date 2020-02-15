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
                csrfToken: request.csrfToken(),
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
                    console.log("error create message ...")
            
                    model = {
                        csrfToken: request.csrfToken(),
                        error
                    }
                    //vad ska render/redirekt vid fel?
                }
                else{
                console.log("else i callback")
                response.redirect("../groups/" + groupId )
                }

            })
        }
    })
})

router.post('/delete/:id', function(request, response) {
    
    //const accountId = request.body.accountId

    console.log("inside deleteMessage router function")
    
    const groupId = request.body.groupId
    const messageId = request.params.id

    console.log(messageId)

    messageManager.deleteMessageById(messageId, function(error){

        if(error){
            console.log("error vid delete message")
            model = {
                csrfToken: request.csrfToken(),
                error
            }
            //vad ska render/redirekt vid fel?
        }
        else{
            console.log("deleteMessage completed")
            response.redirect("/groups/" + groupId)
        }

    })
})


module.exports = router