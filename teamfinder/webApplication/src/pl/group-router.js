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
                error
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
                    databaseErrors
                }
                response.render('group-finder.hbs', model)
            }
            else {
                groupManager.getAllGroups(function (error, groups) {
                    if (error) {
                        const model = {
                            error
                        }
                        response.render('group-finder.hbs', model)
                    }
                    else {
                        const model = {
                            groups
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
                error
            }
            response.render('group-finder.hbs', model)
        }
        else {
            accountManager.getAccountById(accountId, function (error, account) {
                if (error) {
                    const model = {
                        error
                    }
                    response.render('group-finder.hbs', model)
                }
                else {
                    const validationErrors = validator.validateRequirements(account, group)
                    if (validationErrors.length > 0) {
                        const model = {
                            validationErrors
                        }
                        response.render('group-finder.hbs', model)
                    }
                    else {
                        groupMemberManager.createGroupMemberLink(accountId, groupId, function (error) {
                            if (error) {
                                const model = {
                                    error
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
                    error
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
                            checkMemberCountErrors
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
                                                activeGroups
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
                                databaseErrors
                            }
                            response.render('group-active.hbs', model)
                        }
                    }
                }
                else {
                    response.render('group-active.hbs')
                }
            }
        })
   
})

router.get('/create', middleware.isAuthorized, function (request, response) {
    response.render('group-create.hbs')
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
                error
            }
            response.render("group-create.hbs", model)
        }
        else {
            const accountId = request.session.accountId

            groupMemberManager.createGroupMemberLink(accountId, groupId, function (error) {
                if (error) {
                    const model = {
                        error
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

//ska ha en middleware för ifdall man är medlem i gruppen
router.get("/:id", function (request, response) {

    const id = request.params.id

    groupMemberManager.getNrOfMembersInGroup(id, function (error) {
        if (error) {
            const model = {
                error
            }
            response.render('group-active.hbs', model)
        }

        else {
            groupManager.getGroupById(id, function (error, group) {

                if (error) {
                    const model = {
                        error
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
                    const model = {
                        group//,
                        //messages
                    }
                    response.render("group-specific.hbs", model)
                    //}
                    //})
                }
            })
        }

    })



})


module.exports = router