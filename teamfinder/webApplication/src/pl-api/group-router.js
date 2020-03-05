const express = require('express')

module.exports = function ({ groupManager, groupMemberManager, accountManager, messageManager }) {

    const router = express.Router()


    router.get('/', function (request, response) {

        console.log("REEEEEEEEEEEEEEEEE")


        const accountId = request.session.accountId
        groupManager.getAllGroupIds(function (error, groupIds) {
            if (error) {
                console.log(error)
                response.status(500).end() // Internal server error
            }
            else if (groupIds.length == 0) {
                response.status(204).end()  // No content
            }
            else {
                var databaseErrors = []
                try {
                    for (var i = 0; i < groupIds.length; i++) {
                        groupMemberManager.getNrOfMembersInGroup(groupIds[i].groupId, function (error) {
                            if (error) {
                                console.log(error)
                                throw (error)
                            }
                        })
                    }
                }
                catch (error) {
                    databaseErrors.push(error)
                }
                if (databaseErrors.length > 0) {
                    console.log(databaseErrors)
                    response.status(500).end()
                }
                else {
                    groupManager.getAllGroups(function (error, groups) {
                        if (error) {
                            console.log(error)
                            response.status(500).end()
                        }
                        else if (groups.length == 0) {
                            response.status(204) // No content
                        }
                        else {
                            if (accountId) {
                                groupManager.getActiveGroups(accountId, function (error, activeGroups) {
                                    if (error) {
                                        console.log(error)
                                        response.status(500).json(error)
                                        response.header("Content-Type", "application/json")
                                    }
                                    else {
                                        const groupIds = getGroupIds(groups)
                                        const activeGroupIds = getGroupIds(activeGroups)
                                        for (var i = groupIds.length; i >= 0; i--) {
                                            if (activeGroupIds.includes(groupIds[i])) {
                                                groups.splice(i, 1) // pop specific element
                                            }
                                        }
                                        response.setHeader("Content-Type", "application/json")
                                        response.status(200).json(groups)
                                    }
                                })
                            }
                            else {
                                response.setHeader("Content-Type", "application/json")
                                response.status(200).json(groups)
                            }
                        }
                    })
                }
            }
        })
    })

    router.get("/:id", function (request, response) {
        const accountId = 1 // VALIDATE USER WITH TOKEN
        
        const groupId = request.params.id
        var isAuthor = false
        const updated = request.query.updated

        const messageIdEdit = request.query.editMessage
        var editMessage = null

        groupMemberManager.getNrOfMembersInGroup(groupId, function (error) {
            if (error) {
                response.header("Content-Type", "application/json")
                response.status(500).json(error)
            }
            else {
                groupManager.getGroupById(groupId, function (error, group) {
                    if (error) {
                        response.header("Content-Type", "application/json")
                        response.status(500).json(error)
                    }
                    else {
                        messageManager.getMessagesByGroupId(groupId, function (error, messages) {
                            if (error) {
                                response.header("Content-Type", "application/json")
                                response.status(500).json(error)
                                // Skicka med group med. Hur?
                                /*const model = {
                                    csrfToken: request.csrfToken(),
                                    error,
                                    group
                                }
                                response.render("group-specific.hbs", model)*/
                            }
                            else if(messages.length == 0){
                                response.status(404).end() // Not found
                            }
                            else {
                                for (i = 0; i < messages.length; i++) {

                                    if (messages[i].accountId == accountId) {
                                        messages[i]['isAuthor'] = true;
                                    }
                                    else {
                                        messages[i]['isAuthor'] = false;
                                    }
                                    if (messages[i].messageId == messageIdEdit) {
                                        editMessage = messages[i]
                                    }
                                }

                                var isAuthor = false
                                if (group.authorId == accountId) {
                                    isAuthor = true
                                }
                                var printUpdatedText = ""
                                if (updated) {
                                    printUpdatedText = "You successfully updated the group information"
                                }
                                response.header("Content-Type", "application/json")
                                response.status(200).json({group})
                                // Skicka med mer data????

                                /*const model = {
                                    csrfToken: request.csrfToken(),
                                    group,
                                    messages,
                                    accountId,
                                    isAuthor,
                                    printUpdatedText,
                                    editMessage
                                }
                                response.render("group-specific.hbs", model)*/
                            }
                        })
                    }
                })
            }
        })
    })

    router.post('/', function (request, response) {
        const groupId = request.body.groupId

        //TODO: Ersätt med token
        const accountId = 3

        groupManager.getGroupById(groupId, function (error, group) {
            if (error) {
                console.log(error)
                response.setHeader("Content-Type", "application/json")
                response.status(500).json(error)
            }
            else if (group.length == 0) {
                response.status(204).end() // No Content
            }
            else {
                accountManager.getAccountById(accountId, function (error, account) {
                    if (error) {
                        console.log(error)
                        response.setHeader("Content-Type", "application/json")
                        response.status(500).json(error)
                    }
                    else if (account.length == 0) {
                        response.status(404).end() // Not Found - Couldn't fetch the account
                    }
                    else {
                        groupMemberManager.createGroupMemberLink(account, group, function (errors) {

                            if (errors && errors.includes("DatabaseError")) {
                                response.setHeader("Content-Type", "application/json")
                                response.status(500).json(errors)
                            }
                            else if (errors && errors.length > 0) {
                                response.setHeader("Content-Type", "application/json")
                                response.status(400).json(errors)
                            }
                            else {
                                response.setHeader("Location", "/groups/" + groupId)
                                response.status(201).end() // created new row
                            }
                        })
                    }
                })
            }
        })
    })

    router.delete('/:id', function (request, response) {

        const groupId = request.params.id

        // Lägga till token för verifiering?? Sker ju inte i ett middleware nu

        groupManager.deleteGroupById(groupId, function (error) {

            if (error) {
                response.setHeader("Content-Type", "application/json")
                response.status(500).json(error)
            }
            else {
                response.setHeader("Location", "/groups")
                response.status(200).end()
            }
        })
    })

    router.put('/:id', function (request, response) {
        const id = request.params.id

        const groupName = request.body.groupName
        const image = request.body.image
        const sport = request.body.sport
        const memberSlots = request.body.memberSlots
        const city = request.body.city
        const minAge = request.body.minAge
        const maxAge = request.body.maxAge
        const skillLevel = request.body.skillLevel
        const gender = request.body.allowedGender

        const group = {
            id,
            groupName,
            image,
            sport,
            memberSlots,
            city,
            minAge,
            maxAge,
            skillLevel,
            gender
        }
        console.log("Group: ", group)
        groupManager.updateGroup(group, function (errors) {
            if (errors && errors.includes("DatabaseError")) {
                response.setHeader("Content-Type", "application/json")
                response.status(500).json(errors)
            }
            else if (errors && errors.length > 0) {
                response.setHeader("Content-Type", "application/json")
                response.status(204).json(errors) // No content
            }

            else {
                response.setHeader("Location", "/groups/" + id)
                response.status(204).end()  // No content
            }

        })
    })

    return router

}