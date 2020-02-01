const express = require('express')
const expressHandlebars = require('express-handlebars')

const groupManager = require('../bll/group-manager')
const router = express.Router()

router.get('/', function(request, response){
    response.redirect('/') // User isn't supposed to be here. Therefore they are redirected.
})

router.get('/finder', function(request, response){

    groupManager.getAllGroups(function(error, groups){
        
        const model = {
            groups
        }
        response.render('group-finder.hbs', model)
    })


})

router.get('/active', function(request, response){
    groupManager.getAllGroups(function(error, groups){

        const model = {
            groups
        }
        response.render('group-active.hbs', model)
    })
})

router.get('/create', function(request, response){
    response.render('group-create.hbs')
})

router.post('/create', function(request, response){
    console.log("testiiing")
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
    
    groupManager.createGroup(groupCredentials, function(errors, result){
        console.log(errors, result)
        if(errors != null){
            const model = {
                errors
            }
            response.render("group-create.hbs", model)
        }
        else{
            response.redirect("/groups/" + result.insertId)
        }
    })

    //TODO:
    //get accountId
    //get groupId
    // * db.joinGroup(accountId, groupId, function(errors, result))
})

router.get("/:id", function(request, response){
    
    const id = request.params.id

    groupManager.findGroupById(id, function(error, group){

    if(error){
        const model = {
            error
        }
        response.render('group-active.hbs', model)
    }
    else{
        console.log("group: ", group)
        const model = {
            group
        }
        response.render("group-specific.hbs", model)
    }
})

})


module.exports = router