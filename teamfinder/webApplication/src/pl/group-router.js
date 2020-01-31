const express = require('express')
const expressHandlebars = require('express-handlebars')
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

router.get('/specific', function(request, response){
    response.render('group-specific.hbs')
})


module.exports = router