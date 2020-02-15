exports.isAuthorized = function(request, response, next){

    console.log("best middleware O.o ")

    //de andra 2 logsen sker inte under funktionsanropet
  
    if(request.session.accountId == null){
        
        console.log("middleware redirects to login")
        response.redirect('/accounts/login/?unAuthorized=true')
    }
    else{
        console.log("middleware: is logged in")
      next()
    }
  
}
