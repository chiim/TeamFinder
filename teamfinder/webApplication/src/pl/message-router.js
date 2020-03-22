const express = require('express')

module.exports = function ({ messageManager, accountManager }) {
    const router = express.Router()

    router.post('/create', function (request, response) {

        const groupId = request.body.groupId
        const accountId = request.session.accountId
        const text = request.body.text


        accountManager.getAccountById(accountId, function (error, account) {

            if (error) {
                const model = {
                    csrfToken: request.csrfToken(),
                    error
                }
                response.render("group-specific.hbs", model)
            }

            else {

                const authorName = account.firstName + ' ' + account.lastName
                
                const message = {
                    groupId,
                    accountId,
                    text,
                    authorName
                }

                messageManager.createMessage(message, function (error) {

                    if (error) {

                        model = {
                            csrfToken: request.csrfToken(),
                            error
                        }
                        response.redirect("../groups/" + groupId + "/?createMessageError=true")

                    }
                    else {
                        response.redirect("../groups/" + groupId)
                    }

                })
            }
        })
    })


    router.post('/editMessage/:id', function (request, response) {

        const messageId = request.params.id
        const groupId = request.body.groupId
        console.log("REEEEEEEEEEEEEE")

        response.redirect("/groups/" + groupId + "/?editMessage=" + messageId)


    })

    router.post('/update/:id', function (request, response) {

        console.log("RIGHT!½")

        const messageId = request.params.id
        const messageText = request.body.text
        const groupId = request.body.groupId

        const message = {
            messageId,
            messageText
        }

        messageManager.updateMessageById(message, function (error) {

            console.log("eyyyy boyyy")
            if (error) {
                console.log("error???")
                response.redirect("../groups/" + groupId + "/?updateMessageError=true")
            }
            else {
                console.log("works!!!")
                response.redirect("/groups/" + groupId)
            }
        })
    })

    router.post('/delete/:id', function (request, response) {

        const groupId = request.body.groupId
        const messageId = request.params.id

        messageManager.deleteMessageById(messageId, function (error) {

            if (error) {
                model = {
                    csrfToken: request.csrfToken(),
                    error
                }
                response.redirect("../groups/" + groupId + "/?deleteMessageError=true")
            }
            else {

                response.redirect("/groups/" + groupId)
            }

        })
    })
    return router
}
