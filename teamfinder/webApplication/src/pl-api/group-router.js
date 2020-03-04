const express = require('express')

module.exports = function ({ groupManager, groupMemberManager, accountManager }) {

    const router = express.Router()

    router.get('/', function (request, response) {
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
                        // Lägga till en sträng som skickas med?
                        // const noAccountFound = "Couldn't fetch the account"
                        response.status(204).end()
                    }
                    else {
                        groupMemberManager.createGroupMemberLink(account, group, function (errors) {
                            if (errors.includes("DatabaseError")) { // Den kommer hit även om det inte blir fel i databasen
                                response.setHeader("Content-Type", "application/json")
                                response.status(500).json(errors)
                            }
                            else if (errors.length > 0) {
                                response.setHeader("Content-Type", "application/json")
                                response.status(400).json(errors)
                            }
                            else {
                                response.setHeader("Location", "/groups/" + groupId)
                                response.status(201).end() // Ska detta va 201 eller 200? Skapar en länk i groupMembers
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
            if (errors) {
                if (errors.includes("DatabaseError")) {
                    response.setHeader("Content-Type", "application/json")
                    response.status(500).json(errors)
                }
                else {
                    console.log("Kommer jag hit?")
                    response.setHeader("Content-Type", "application/json")
                    response.status(204).json(errors) // No content
                }
            }
            else {
                response.setHeader("Location", "/groups/" + id)
                response.status(204).end()  // No content

                // Ska man ta med queryn updated=true i api'n eller hanteras det i den applikationen?
                //response.redirect('/groups/' + id + '/?updated=true')

            }
        })
    })

    return router

}