const express = require('express')

module.exports = function ({ groupManager }) {

    const router = express.Router()

    router.get('/', function (request, response) {
        const accountId = request.session.accountId
        groupManager.getAllGroupIds(function (error, groupIds) {
            if (error) {
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
                    response.status(500).end()
                }
                else {
                    groupManager.getAllGroups(function (error, groups) {
                        if (error) {
                            response.status(500).end()
                        }
                        else if (groups.length == 0) {
                            response.status(204) // No content
                        }
                        else {
                            if (accountId) {
                                groupManager.getActiveGroups(accountId, function (error, activeGroups) {
                                    if (error) {
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
                                response.status(200).status.json(groups)
                            }
                        }
                    })
                }
            }
        })
    })



    return router

}