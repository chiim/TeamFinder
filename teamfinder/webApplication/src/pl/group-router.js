const express = require('express')

module.exports = function ({ groupManager, groupMemberManager, messageManager, accountManager, middleware }) {

    const router = express.Router()

    router.get('/', function (request, response) {
        response.redirect('/') // User isn't supposed to be here. Therefore they are redirected to home.
    })

    function getGroupIds(groups) {
        const groupIds = []
        for (var i = 0; i < groups.length; i++) {
            groupIds.push(groups[i].groupId)
        }
        return groupIds
    }

    router.get('/finder', function (request, response) {
        const accountId = request.session.accountId
        groupManager.getAllGroups(function (error, groups) {
            if (error) {
                const model = {
                    error,
                    csrfToken: request.csrfToken()
                }
                response.render('group-finder.hbs', model)
            }
            else {
                var databaseErrors = []
                const memberGroupCount = []
                try {
                    for (var i = 0; i < groups.length; i++) {
                        groupMemberManager.getNrOfMembersInGroup(groups[i].groupId, function (error, nrOfMembers) {
                            console.log("log nrOfMembers: ", nrOfMembers)
                            if (error) {
                                console.log(error)
                                throw (error)
                            }
                            else {
                                memberGroupCount.push(nrOfMembers)
                                console.log("memberGroupCount after push: ", memberGroupCount)
                            }

                            if (memberGroupCount.length == groups.length) {
                                if (accountId) {

                                    const errors = removeActiveGroups(accountId, groups)

                                    if (errors) {
                                        const model = {
                                            groups,
                                            csrfToken: request.csrfToken()
                                        }
                                        response.render('group-finder.hbs', model)
                                    }
                                    else {
                                        groups = addMemberCountToGroups(memberGroupCount, groups)
                                        const model = {
                                            groups,
                                            csrfToken: request.csrfToken()
                                        }
                                        response.render('group-finder.hbs', model)
                                    }
                                }
                                else {
                                    groups = addMemberCountToGroups(memberGroupCount, groups)
                                    const model = {
                                        groups,
                                        csrfToken: request.csrfToken()
                                    }
                                    response.render('group-finder.hbs', model)
                                }
                            }
                        })
                    }
                }
                catch (error) {
                    databaseErrors.push(error)
                }
                if (databaseErrors.length > 0) {
                    const model = {
                        databaseErrors,
                        csrfToken: request.csrfToken()
                    }
                    response.render('group-finder.hbs', model)
                }
            }
        })
    })

    removeActiveGroups = function (accountId, groups) {
        const errors = []
        groupManager.getActiveGroupIds(accountId, function (error, activeGroupIds) {
            if (error) {
                const model = {
                    errors,
                    csrfToken: request.csrfToken()
                }
                return errors
                response.render('group-finder.hbs', model)
            }
            else {
                const groupIds = getGroupIds(groups)
                const extractedActiveGroupIds = []
                for (var i = 0; i < activeGroupIds.length; i++) {
                    extractedActiveGroupIds.push(activeGroupIds[i].groupId)
                }

                for (var i = groupIds.length - 1; i >= 0; i--) {
                    if (extractedActiveGroupIds.includes(groupIds[i])) {
                        groups.splice(i, 1) // pop specific element
                    }
                }
            }
        })
    }

    addMemberCountToGroups = function (memberGroupCount, groups) {

        for (var i = 0; i < groups.length; i++) {
            groups[i]['nrOfMembers'] = memberGroupCount[i]
        }
        return groups

    }

    router.post('/finder', function (request, response) {
        const groupId = request.body.groupId
        const accountId = request.session.accountId
        groupManager.getGroupById(groupId, function (error, group) {
            if (error) {
                const model = {
                    error,
                    csrfToken: request.csrfToken()
                }
                response.render('group-finder.hbs', model)
            }
            else {
                accountManager.getAccountById(accountId, function (error, account) {
                    if (error) {
                        const model = {
                            error,
                            csrfToken: request.csrfToken()
                        }
                        response.render('group-finder.hbs', model)
                    }
                    else {
                        groupMemberManager.createGroupMemberLink(account, group, function (error) {
                            if (error) {
                                const model = {
                                    error,
                                    csrfToken: request.csrfToken()
                                }
                                response.render('group-finder.hbs', model)
                            }
                            else {
                                response.redirect('/groups/' + groupId)
                            }
                        })
                    }
                })
            }
        })
    })

    router.get('/active', middleware.isAuthorized, function (request, response) {

        const accountId = request.session.accountId

        groupManager.getActiveGroupIds(accountId, function (error, groupIds) {
            var databaseErrors = []
            if (error) {
                const model = {
                    error,
                    csrfToken: request.csrfToken()
                }
                response.render('group-active.hbs', model)
            }
            else {
                if (groupIds.length > 0) {
                    var checkMemberCountErrors = []
                    try {
                        for (var i = 0; i < groupIds.length; i++) {

                            groupMemberManager.getNrOfMembersInGroup(groupIds[i].groupId, function (error) {
                                if (error) {
                                    console.log(error)
                                    throw (error)
                                }
                                else {

                                    if (i == groupIds.length) {

                                        // solve group updates to slow
                                        //get groups should be done here...
                                    }

                                }


                            })

                        }
                    }
                    catch (error) {
                        checkMemberCountErrors.push(error)
                    }
                    if (checkMemberCountErrors.length > 0) {
                        const model = {
                            checkMemberCountErrors,
                            csrfToken: request.csrfToken()
                        }
                        response.render('group-active.hbs', model)
                    }
                    else {
                        const activeGroups = []
                        try {
                            for (var i = 0; i < groupIds.length; i++) {
                                groupManager.getGroupById(groupIds[i].groupId, function (error, group) {
                                    if (error) {
                                        throw (error)
                                    }
                                    else {
                                        activeGroups.push(group)
                                        if (activeGroups.length == groupIds.length) {
                                            const model = {
                                                activeGroups,
                                                csrfToken: request.csrfToken()
                                            }
                                            response.render('group-active.hbs', model)
                                        }
                                    }
                                })
                            }
                        }
                        catch (error) {
                            databaseErrors.push(error)
                        }
                        if (databaseErrors.length > 0) {
                            const model = {
                                databaseErrors,
                                csrfToken: request.csrfToken()
                            }
                            response.render('group-active.hbs', model)
                        }
                    }
                }
                else {
                    const model = {
                        csrfToken: request.csrfToken()
                    }
                    response.render('group-active.hbs', model)
                }
            }
        })

    })


    router.post('/active', function (request, response) {

        const groupId = request.body.groupId

        response.redirect('/groups/' + groupId)


    })

    router.get('/create', middleware.isAuthorized, function (request, response) {

        const model = {
            csrfToken: request.csrfToken()
        }
        response.render('group-create.hbs', model)
    })



    router.post('/create', function (request, response) {
        const groupName = request.body.groupName
        const image = request.body.image
        const sport = request.body.sport
        const nrOfMembers = 1
        const memberSlots = request.body.memberSlots
        const city = request.body.city
        const minAge = request.body.minAge
        const maxAge = request.body.maxAge
        const skillLevel = request.body.skillLevel
        const allowedGender = request.body.allowedGender

        const accountId = request.session.accountId
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
            if (errors) {
                const model = {
                    errors,
                    csrfToken: request.csrfToken()
                }
                response.render("group-create.hbs", model)
            }
            else {
                accountManager.getAccountById(accountId, function (errors, account) {
                    if (errors) {
                        const model = {
                            errors,
                            csrfToken: request.csrfToken()
                        }
                        response.render('group-create.hbs', model)
                    }
                    else {
                        groupManager.getGroupById(groupId, function (errors, group) {
                            if (errors) {
                                const model = {
                                    errors,
                                    csrfToken: request.csrfToken()
                                }
                                response.render('group-create.hbs', model)
                            }
                            else {
                                groupMemberManager.createGroupMemberLink(account, group, function (errors) {
                                    if (errors) {
                                        const model = {
                                            errors,
                                            csrfToken: request.csrfToken()
                                        }
                                        response.render('group-create.hbs', model)
                                    }
                                    else {
                                        response.redirect("/groups/" + groupId)
                                    }
                                })
                            }
                        })
                    }
                })

            }
        })
    })


    //ska ha en middleware för ifall man är medlem i gruppen
    router.get("/:id", function (request, response) {
        const accountId = request.session.accountId
        const groupId = request.params.id
        var isAuthor = false
        const updated = request.query.updated

        const messageIdEdit = request.query.editMessage
        var editMessage = null

        groupMemberManager.getNrOfMembersInGroup(groupId, function (error) {
            if (error) {
                const model = {
                    error,
                    csrfToken: request.csrfToken()
                }
                response.render('group-active.hbs', model)
            }

            else {
                groupManager.getGroupById(groupId, function (error, group) {
                    if (error) {

                        const model = {
                            error,
                            csrfToken: request.csrfToken(),
                            isAuthor
                        }
                        response.render('group-active.hbs', model)
                    }
                    else {
                        messageManager.getMessagesByGroupId(groupId, function (error, messages) {

                            if (error) {

                                const model = {
                                    csrfToken: request.csrfToken(),
                                    error,
                                    group
                                }
                                response.render("group-specific.hbs", model)
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
                                console.log("AuthorId: ", group.authorId)
                                console.log("AccountId: ", accountId)

                                if (group.authorId == accountId) {
                                    isAuthor = true
                                }
                                var printUpdatedText = ""
                                if (updated) {
                                    printUpdatedText = "You successfully updated the group information"
                                }

                                const model = {
                                    csrfToken: request.csrfToken(),
                                    group,
                                    messages,
                                    accountId,
                                    isAuthor,
                                    printUpdatedText,
                                    editMessage
                                }
                                response.render("group-specific.hbs", model)
                            }



                        })
                    }
                })
            }
        })
    })

    router.post('/:id', function (request, response) { // ADD MIDDLEWARE FOR VALIDATING ACCOUNT IN GROUP
        const id = request.params.id
        response.redirect('/groups/' + id + '/edit')
    })

    router.post('/:id/redirectToEdit', function (request, response) {

        // User is validated in the id/edit GET-request below. If they somehow create this button, they will still be redirected back to the specific group.
        const id = request.params.id
        response.redirect('/groups/' + id + '/edit')

    })

    router.post('/:id/redirectToManageMembers', function (request, response) {

        const id = request.params.id
        response.redirect('/groups/' + id + '/manageMembers')
    })

    router.post('/:id/leave', function (request, response) {

        const groupId = request.params.id
        const accountId = request.session.accountId

        groupManager.getGroupById(groupId, function (error, group) {
            if (error) {
                const model = {
                    error,
                    csrfToken: request.csrfToken()
                }
                response.render('group-specific.hbs', model)
            }
            else {
                groupMemberManager.removeGroupMemberLink(accountId, group, function (error) {
                    if (error) {
                        const model = {
                            error,
                            csrfToken: request.csrfToken()
                        }
                        response.render('group-specific.hbs', model)
                    }
                    else {
                        response.redirect('/groups/active')
                    }
                })
            }
        })

    })

    router.get('/:id/manageMembers', function (request, response) {
        const accountId = request.session.accountId
        const groupId = request.params.id

        groupManager.getGroupById(groupId, function (error, group) {
            if (error) {
                const model = {
                    error
                }
                response.render('group-manageMembers.hbs', model)
            }
            else {
                const authorId = group.authorId
                if (accountId == group.authorId) {
                    groupMemberManager.getGroupMembers(groupId, function (error, accountIds) {
                        if (error) {
                            const model = {
                                error,
                                csrfToken: request.csrfToken()
                            }
                            response.render('group-manageMembers.hbs', model)
                        }
                        else {
                            const members = []
                            const databaseErrors = []
                            try {
                                for (var i = 0; i < accountIds.length; i++) {
                                    accountManager.getAccountById(accountIds[i].accountId, function (error, account) {
                                        if (error) {
                                            throw (error)
                                        }
                                        else {
                                            if (account.accountId == group.authorId) {
                                                author = group.authorId
                                            }
                                            else {
                                                author = false
                                            }
                                            members.push(account)
                                            if (members.length == accountIds.length) {
                                                if (databaseErrors.length > 0) {
                                                    const model = {
                                                        databaseErrors,
                                                        members,
                                                        authorId,
                                                        csrfToken: request.csrfToken()
                                                    }
                                                    response.render('group-manageMembers.hbs', model)
                                                }
                                                else {
                                                    const model = {
                                                        members,
                                                        authorId,
                                                        csrfToken: request.csrfToken()
                                                    }
                                                    response.render('group-manageMembers.hbs', model)
                                                }
                                            }
                                        }
                                    })
                                }
                            }
                            catch (error) {
                                databaseErrors.push(error)
                            }
                        }
                    })
                }
                else {
                    response.redirect('/groups/' + groupId)
                }
            }
        })
    })

    router.post('/:id/manageMembers', function (request, response) {

        const accountId = request.body.accountId
        const authorId = request.session.accountId
        const groupId = request.params.id

        groupManager.getGroupById(groupId, function (error, group) {
            if (error) {
                const model = {
                    error,
                    csrfToken: request.csrfToken()
                }
                response.render('group-manageMembers.hbs', model)
            }
            else {
                if (group.authorId == authorId) {
                    groupMemberManager.removeGroupMemberLink(accountId, group, function (error) {
                        if (error) {
                            const model = {
                                error,
                                csrfToken: request.csrfToken()
                            }
                            response.render('group-manageMembers.hbs', model)
                        }
                        else {
                            const success = "You successfully kicked that member."
                            const model = {
                                success,
                                csrfToken: request.csrfToken()
                            }
                            response.render('group-manageMembers.hbs', model)
                        }
                    })
                }
                else {
                    response.redirect('/groups/' + groupId)
                }
            }
        })
    })



    router.get('/:id/edit', function (request, response) {
        const accountId = request.session.accountId
        const groupId = request.params.id
        groupManager.getGroupById(groupId, function (error, group) {
            if (error) {
                const model = {
                    error,
                    csrfToken: request.csrfToken()
                }
                response.render('group-edit.hbs', model)
            }
            else {
                if (accountId == group.authorId) {

                    const model = {
                        group,
                        csrfToken: request.csrfToken()
                    }
                    response.render('group-edit.hbs', model)
                }
                else {
                    response.redirect('/groups/' + groupId)
                }
            }
        })
    })

    // Random member cant get here due to the get request validating that it's the author trying to access webpage
    router.post('/delete/:id', function (request, response) {

        const groupId = request.params.id

        groupManager.deleteGroupById(groupId, function (error) {

            if (error) {
                model = {
                    csrfToken: request.csrfToken(),
                    error
                }
                response.render('group-specific.hbs', model)
            }
            else {
                response.redirect('/groups/active')
            }
        })
    })

    router.post('/:id/edit', function (request, response) {
        const groupId = request.params.id
        console.log(groupId)

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

        groupManager.updateGroup(group, function (errors) {
            if (errors) {

                const model = {
                    errors,
                    csrfToken: request.csrfToken(),
                    failedGroup
                }
                response.render('group-edit.hbs', model)
            }
            else {
                response.redirect('/groups/' + groupId + '/?updated=true')
            }
        })
    })
    return router
}
