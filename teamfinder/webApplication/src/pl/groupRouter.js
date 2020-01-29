const express = require('express')

const router = express.Router()

router.get('/', function(request, response){
    response.render('groupFinder.hbs')
})

router.get('/activeGroups.hbs', function(request, response){
    
})


module.exports = router