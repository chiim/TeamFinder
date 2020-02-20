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

                const authorName = account.FirstName + ' ' + account.LastName

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

        response.redirect("/groups/" + groupId + "/?editMessage=" + messageId)


    })

    router.post('/update/:id', function (request, response) {

        const messageId = request.params.id
        const messageText = request.body.text
        const groupId = request.body.groupId

        const message = {
            messageId,
            messageText
        }

        messageManager.updateMessageById(message, function (error) {

            if (error) {
                response.redirect("../groups/" + groupId + "/?updateMessageError=true")
            }
            else {
                response.redirect("/groups/" + groupId)
            }
        })
    })

    router.post('/delete/:id', function (request, response) {

        //const accountId = request.body.accountId

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
