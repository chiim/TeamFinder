const express = require('express')

module.exports = function ({ groupManager, groupMemberManager, messageManager, accountManager, middleware }) {

    const router = express.Router()

    router.get('/', function (request, response) {
        response.redirect('/') // User isn't supposed to be here. Therefore they are redirected to home.
    })

    function getGroupIds(groups) {
        const groupIds = []
        for (var i = 0; i < groups.length; i++) {
            groupIds.push(groups[i].GroupId)
        }
        return groupIds
    }

    router.get('/finder', function (request, response) {
        const accountId = request.session.accountId
        groupManager.getAllGroupIds(function (error, groupIds) {
            if (error) {
                const model = {
                    error,
                    csrfToken: request.csrfToken()
                }
                response.render('group-finder.hbs', model)
            }
            else {
                var databaseErrors = []
                try {
                    for (var i = 0; i < groupIds.length; i++) {
                        groupMemberManager.getNrOfMembersInGroup(groupIds[i].GroupId, function (error) {
                            if (error) {
                                throw (error)
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
                else {
                    groupManager.getAllGroups(function (error, groups) {
                        if (error) {
                            const model = {
                                error,
                                groups,
                                csrfToken: request.csrfToken()
                            }
                            response.render('group-finder.hbs', model)
                        }
                        else {
                            if (accountId) {
                                const errors = []
                                try {
                                    groupManager.getActiveGroups(accountId, function (error, activeGroups) {
                                        if (error) {
                                            throw (error)
                                        }
                                        else {
                                            const groupIds = getGroupIds(groups)
                                            const activeGroupIds = getGroupIds(activeGroups)
                                            for (var i = groupIds.length; i >= 0; i--) {
                                                if (activeGroupIds.includes(groupIds[i])) {
                                                    groups.splice(i, 1) // pop specific element
                                                }
                                            }
                                        }
                                    })
                                }
                                catch (error) {
                                    errors.push(error)
                                }
                                if (errors.length > 0) {
                                    const model = {
                                        errors,
                                        csrfToken: request.csrfToken()
                                    }
                                    response.render('group-finder.hbs', model)
                                }
                            }
                            const model = {
                                groups,
                                csrfToken: request.csrfToken()
                            }
                            response.render('group-finder.hbs', model)
                        }
                    })
                }
            }
        })
    })

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

                        const validationErrors = groupManager.validateRequirements(account, group)
                        if (validationErrors.length > 0) {
                            const model = {
                                validationErrors,
                                csrfToken: request.csrfToken()
                            }
                            response.render('group-finder.hbs', model)
                        }
                        else {
                            groupMemberManager.createGroupMemberLink(accountId, groupId, function (error) {
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
                    }
                })
            }
        })
    })

    router.get('/active', middleware.isAuthorized, function (request, response) {

        const accountId = request.session.accountId

        groupManager.getActiveGroups(accountId, function (error, groupIds) {
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
                            groupMemberManager.getNrOfMembersInGroup(groupIds[i].GroupId, function (error) {
                                if (error) {
                                    throw (error)
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
                                groupManager.getGroupById(groupIds[i].GroupId, function (error, group) {
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
            allowedGender
        }

        groupManager.createGroup(groupCredentials, function (error, groupId) {
            if (error) {
                const model = {
                    error,
                    csrfToken: request.csrfToken()
                }
                response.render("group-create.hbs", model)
            }
            else {
                const accountId = request.session.accountId

                groupMemberManager.createGroupMemberLink(accountId, groupId, function (error) {
                    if (error) {
                        const model = {
                            error,
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

                                    if (messages[i].AccountId == accountId) {
                                        messages[i]['isAuthor'] = true;
                                    }
                                    else {
                                        messages[i]['isAuthor'] = false;
                                    }
                                }

                                var isAuthor = false
                                if (group.AuthorId == accountId) {
                                    isAuthor = true
                                }
                                var printUpdatedText = ""
                                if (updated) {
                                    printUpdatedText = "You successfully updated the group information"
                                }
                                if (messages[i].MessageId == messageIdEdit) {
                                    editMessage = messages[i]
                                }
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
                const authorId = group.AuthorId
                if (accountId == group.AuthorId) {
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
                                    accountManager.getAccountById(accountIds[i].AccountId, function (error, account) {
                                        if (error) {
                                            throw (error)
                                        }
                                        else {
                                            if (account.AccountId == group.AuthorId) {
                                                author = group.AuthorId
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
                if (group.AuthorId == authorId) {
                    groupMemberManager.removeGroupMemberLink(accountId, groupId, function (error) {
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
                if (accountId == group.AuthorId) {
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

    //add middleware for validating right account does it. or is that handeled in hbs files?
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

        groupManager.updateGroup(group, function (errors) {
            if (errors) {
                const model = {
                    errors,
                    csrfToken: request.csrfToken(),
                    id
                }
                response.render('group-edit.hbs', model)
            }
            else {
                response.redirect('/groups/' + id + '/?updated=true')
            }
        })
    })
    return router
}
//module.exports = router