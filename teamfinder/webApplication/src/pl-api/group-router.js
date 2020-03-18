const jwt = require('jsonwebtoken')
const express = require('express')

module.exports = function ({ groupManager, groupMemberManager, accountManager, messageManager }) {

    const router = express.Router()

    function getAccountId(accessToken) {
        const serverSecret = "sdfkjdslkfjslkfd"

        if (accessToken) {
            const payload = jwt.verify(accessToken, serverSecret)
            return payload.accountId
        }
        else {
            return null
        }
    }

    router.get('/', function (request, response) {
        const accountId = request.query.accountId // Retrieved from idToken. If null: Not a user

        console.log("accountId: ", accountId)
        groupManager.getAllGroups(function (error, groups) {
            if (error) {
                console.log(error)
                response.status(500).end() // Internal server error
            }
            else if (groups.length == 0) {
                response.status(204).end()  // No content
            }
            else {
                var databaseErrors = []
                var memberGroupCount = []
                try {
                    for (var i = 0; i < groups.length; i++) {
                        groupMemberManager.getNrOfMembersInGroup(groups[i].groupId, function (error, nrOfMembers) {
                            if (error) {
                                console.log(error)
                                throw (error)
                            }
                            else {
                                memberGroupCount.push(nrOfMembers)
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
                    console.log("show accountId: ", accountId)
                    if (accountId) {
                        groupManager.getActiveGroupIds(accountId, function (error, activeGroupIds) {
                            if (error) {
                                console.log(error)
                                response.status(500).json(error)
                            }
                            else {
                                const groupIds = getGroupIdsFromGroups(groups)
                                console.log("GroupIds: ", groupIds)
                                const extractedActiveGroupIds = []
                                for (var i = 0; i < activeGroupIds.length; i++) {
                                    extractedActiveGroupIds.push(activeGroupIds[i].groupId)
                                }

                                for (var i = groupIds.length - 1; i >= 0; i--) {
                                    console.log("Current id in loop: ", groupIds[i])
                                    if (!extractedActiveGroupIds.includes(groupIds[i])) {
                                        groups.splice(i, 1) // pop specific element
                                    }
                                }
                                console.log("ActiveGroupIds: ", activeGroupIds)
                                console.log("All groups: ", groups)
                                groups = addMemberCountToGroups(memberGroupCount, groups)
                                response.status(200).json(groups)

                            }
                        })
                    }
                    else {
                        groups = addMemberCountToGroups(memberGroupCount, groups)
                        response.status(200).json(groups)
                    }
                }
            }
        })
    })

    addMemberCountToGroups = function (memberGroupCount, groups) {

        for (var i = 0; i < groups.length; i++) {
            groups[i]['nrOfMembers'] = memberGroupCount[i]
        }
        return groups

    }

    getGroupIdsFromGroups = function (groups) {
        const groupIds = []
        for (var i = 0; i < groups.length; i++) {
            groupIds.push(groups[i].groupId)
        }
        return groupIds
    }

    getAccountIds = function (dict) {
        const accountIds = []
        for (var i = 0; i < dict.length; i++) {
            accountIds.push(dict[i].accountId)
        }
        return accountIds
    }


    router.get("/:id", function (request, response) {
        console.log("Inside get id")
        const accessToken = request.headers.authorization.split(" ")[1]
        const accountId = getAccountId(accessToken)
        const groupId = request.params.id
        var isAuthor = false

        groupMemberManager.getNrOfMembersInGroup(groupId, function (error) {
            if (error) {
                response.status(500).json(error)
            }
            else {
                groupMemberManager.getGroupMembers(groupId, function (error, dictOfAccountIds) {
                    const accountIds = getAccountIds(dictOfAccountIds)

                    if (error) {
                        response.status(500).json(error)
                    }
                    else if (!accountIds.includes(accountId)) {
                        const error = "You are not a member of this group"
                        response.status(401).json(error)
                    }
                    else {
                        groupManager.getGroupById(groupId, function (error, group) {
                            if (error) {
                                response.status(500).json(error)
                            }
                            else {
                                if (group.authorId == accountId) {
                                    isAuthor = true
                                }
                                response.status(200).json({ group, isAuthor })
                            }
                        })
                    }
                })
            }
        })

    })


    router.post('/', function (request, response) {
        console.log(request.body)
        const groupName = request.body.groupName
        const image = "Volleyball" // Hard coded because you shouldnt be able to choose image here.
        const sport = request.body.sport
        const nrOfMembers = 1
        const memberSlots = request.body.memberSlots
        const city = request.body.city
        const minAge = request.body.minAge
        const maxAge = request.body.maxAge
        const skillLevel = request.body.skillLevel
        const allowedGender = request.body.allowedGender

        const accessToken = request.headers.authorization.split(" ")[1]
        const accountId = getAccountId(accessToken)
        if (accountId) {
            const groupCredentials = {
                groupName,
                image,
                sport,
                nrOfMembers,
                memberSlots,
                city,
                minAge,
                maxAge,
                skillLevel,
                allowedGender,
                accountId
            }
            groupManager.createGroup(groupCredentials, function (errors, groupId) {
                if (errors && errors.includes("DatabaseError")) {
                    response.status(500).json(errors)
                }
                else if (errors && errors.length > 0) {
                    response.status(400).json(errors)
                }
                else {
                    accountManager.getAccountById(accountId, function (error, account) {
                        if (error) {
                            response.status(500).json(error)
                        }
                        else {
                            console.log(accountId, groupId)
                            groupManager.getGroupById(groupId, function (error, group) {
                                if (error) {
                                    response.status(500).json(error)
                                }
                                else {

                                    groupMemberManager.createGroupMemberLink(account, group, function (error) {
                                        if (error) {
                                            console.log("errors: ", error)
                                            response.status(500).json(error)
                                        }
                                        else {
                                            response.header("Location", "/group/" + groupId)
                                            response.status(201).end()
                                        }
                                    })
                                }
                            })
                        }
                    })
                }

            })
        }
        else { // User shouldnt be able to get here at all
            const error = "You must be logged in to create a group"
            response.status(401).json(error)
        }
    })

    /*router.post('/', function (request, response) { // Join a group
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
    })*/

    router.delete('/:id', function (request, response) {

        const groupId = request.params.id
        const accessToken = request.headers.authorization.split(" ")[1]
        const accountId = getAccountId(accessToken)

        // Lägga till token för verifiering?? Sker ju inte i ett middleware nu

        groupManager.getGroupById(groupId, function (error, group) {
            if (error) {
                response.status(500).json(error)
            }
            else if (group.authorId != accountId) {
                response.status(401).end()
            }
            else {
                groupManager.deleteGroupById(groupId, function (error) {

                    if (error) {
                        response.status(500).json(error)
                    }
                    else {
                        response.status(204).end()
                    }
                })
            }
        })
    })

    router.put('/:id', function (request, response) {
        const groupId = request.params.id
        console.log("Inside update group")
        const accessToken = request.headers.authorization.split(" ")[1]
        console.log("accessToken: ", accessToken)
        const accountId = getAccountId(accessToken)

        groupManager.getGroupById(groupId, function (error, group) { // Används för att verifiera att kontot är från grupp skaparen
            if (error) {
                response.status(500).json(error)
            }
            else if (group.length == 0) {
                response.status(404).end()
            }
            else if (group.authorId != accountId) {
                response.status(401).end()
            }
            else {

                const groupName = request.body.groupName
                const image = "Volleyball" // Hardcoded in SPA
                const sport = request.body.sport
                const memberSlots = request.body.memberSlots
                const city = request.body.city
                const minAge = request.body.minAge
                const maxAge = request.body.maxAge
                const skillLevel = request.body.skillLevel
                const gender = request.body.allowedGender

                const updatedGroup = {
                    groupId,
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
                console.log("Group: ", updatedGroup)
                groupManager.updateGroup(updatedGroup, function (errors) {
                    if (errors && errors.includes("DatabaseError")) {
                        console.log("Error: ", errors)
                        response.status(500).json(errors)
                    }
                    else if (errors && errors.length > 0) {
                        response.status(204).json(errors) // No content
                    }

                    else {
                        response.setHeader("Location", "/group/" + groupId)
                        response.status(204).end()
                    }

                })
            }
        })

    })

    return router

}