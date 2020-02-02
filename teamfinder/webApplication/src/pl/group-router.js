const express = require('express')
const expressHandlebars = require('express-handlebars')
const groupManager = require('../bll/group-manager')
const groupMemberManager = require('../bll/groupMember-manager')

const accountManager = require('../bll/account-manager')
const router = express.Router()

router.get('/', function (request, response) {
    response.redirect('/') // User isn't supposed to be here. Therefore they are redirected.
})

router.get('/finder', function (request, response) {

    groupManager.getAllGroups(function (error, groups) {

        const model = {
            groups
        }
        response.render('group-finder.hbs', model)
    })


})

router.get('/active', function (request, response) {

    /*accountManager.getAccountById(loginId, function(error, account){

    })*/
    const accountId = 1 // Hard coded account until we have a login to fetch accountId from db.
    groupManager.getActiveGroups(accountId, function(error, groups){
        if(error){
            const model = {
                error
            }
            response.render('group-active.hbs', model)
        }

        else{
            const model = {
                groups
            }
            response.render('group-active.hbs', model)
        }
    })
})

router.get('/create', function (request, response) {
    response.render('group-create.hbs')
})

router.post('/create', function (request, response) {
    const groupName = request.body.groupName
    const image = request.body.image
    const sport = request.body.sport
    const nrOfMembers = 0
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
            console.log(error)
            const model = {
                error
            }
            response.render("group-create.hbs", model)
        }
        else {
            const accountId = 1
            groupMemberManager.createGroupMemberLink(accountId, groupId, function(error){
                if(error){
                    const model = {
                        error
                    }
                    response.render('group-create.hbs', model)
                }
                else{
                    response.redirect("/groups/" + groupId)
                }
            })
        }
    })

    //TODO:
    //get accountId
    //get groupId
    // * db.joinGroup(accountId, groupId, function(errors, result))
})

router.get("/:id", function (request, response) {

    const id = request.params.id

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

})


module.exports = router