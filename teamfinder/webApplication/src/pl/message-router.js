const express = require('express')
const expressHandlebars = require('express-handlebars')
const router = express.Router()
const messageManager = require('../bll/message-manager')


router.post('/create', function(request, response){

    console.log("message create reached")

    const groupId = request.body.groupId
    const accountId = 1 //This should be the account logged in making the message
    const text = request.body.text
    const authorName = "temporary" //ska detta namnet hämtas med getAccountById eller finns nuvarande inloggade account namnet i session??

    const message = {
        groupId,
        accountId,
        text,
        authorName
    }
    console.log(message)

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
})



module.exports = router