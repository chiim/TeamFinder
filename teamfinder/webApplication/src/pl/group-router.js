const express = require('express')
const expressHandlebars = require('express-handlebars')
const groupManager = require('../bll/group-manager')
const groupMemberManager = require('../bll/groupMember-manager')
const validator = require('../bll/validator')
const middleware = require('../pl/middleware-router')

const accountManager = require('../bll/account-manager')
const router = express.Router()

router.get('/', function (request, response) {
    response.redirect('/') // User isn't supposed to be here. Therefore they are redirected.
})

router.get('/finder', function (request, response) {

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
                            csrfToken: request.csrfToken()
                        }
                        response.render('group-finder.hbs', model)
                    }
                    else {
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
                    const validationErrors = validator.validateRequirements(account, group)
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
                    /*messageManager.getMessagesByGroupId(id, function (error, messages) {
                        if (error) {
                            const model = {
                                error
                            }
                            response.render("group-specific.hbs", model)
                        }
                        else {*/
                    if (accountId == group.AuthorId) {
                        isAuthor = true
                        const model = {
                            group,
                            csrfToken: request.csrfToken(),
                            isAuthor
                        }
                        response.render('group-specific.hbs', model)
                    }
                    else {

                        const model = {
                            group,
                            csrfToken: request.csrfToken(),
                            isAuthor
                        }
                        response.render("group-specific.hbs", model)
                    }
                    //}
                    //})
                }
            })
        }
    })
})

router.post('/:id', function (request, response) { // ADD MIDDLEWARE FOR VALIDATING ACCOUNT IN GROUP
    const id = request.params.id
    response.redirect('/groups/' + id + '/edit')
})

router.get('/:id/edit', function (request, response) {
    const accountId = request.session.accountId
    const groupId = request.params.id
    console.log("AccountId: " + accountId + ". GroupId: " + groupId)
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

    groupManager.updateGroup(group, function (error) {
        if (error) {
            const model = {
                error,
                csrfToken: request.csrfToken()
            }
            response.render('/:id/edit', model)
        }
        else {
            response.redirect('/groups/' + id)
        }
    })

})
module.exports = router