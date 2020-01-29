const express = require('express')
const expressHandlebars = require('express-handlebars')
const router = express.Router()

router.get('/finder', function(request, response){
    response.render('group-finder.hbs')
})

router.get('/active', function(request, response){
    response.render('group-active.hbs')
})


module.exports = router