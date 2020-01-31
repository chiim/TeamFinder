const express = require('express')
const expressHandlebars = require('express-handlebars')

const groupManager = require('../bll/group-manager')
const router = express.Router()

router.get('/finder', function(request, response){
    response.render('group-finder.hbs')
})

router.get('/active', function(request, response){
    response.render('group-active.hbs')
})

router.get('/create', function(request, response){
    response.render('group-create.hbs')
})

router.post('/create', function(request, response){
    console.log("testiiing")
    const groupName = request.body.groupName
    const sport = request.body.sport
    const memberSlots = request.body.memberSlots
    const city = request.body.city
    const minAge = request.body.minAge
    const maxAge = request.body.maxAge
    const skillLevel = request.body.skillLevel
    const allowedGender = request.body.allowedGender

    const groupCredentials = {
        groupName, 
        sport, 
        memberSlots,
        city,
        minAge,
        maxAge,
        skillLevel,
        allowedGender
    }
    
    groupManager.createGroup(groupCredentials, function(errors, result){
        console.log(errors, result)
        if(errors.length > 0){
            const model = {
                errors
            }
            response.render("/create.hbs", model)
        }
        else{
            response.redirect("/" + result.insertId)
        }
    })
})

router.get("/:id", function(request, response){
    
    //const id = request.body.params



    response.render("/")
})


module.exports = router