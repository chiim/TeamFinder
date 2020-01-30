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

    

})


module.exports = router