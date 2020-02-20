exports.isAuthorized = function(request, response, next){
    //de andra 2 logsen sker inte under funktionsanropet
  
    if(request.session.accountId == null){
        
        response.redirect('/accounts/login/?unAuthorized=true')
    }
    else{
      next()
    }
  
}
