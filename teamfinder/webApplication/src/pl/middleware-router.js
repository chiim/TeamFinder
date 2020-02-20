<<<<<<< HEAD

module.exports = function () {
  return {
    isAuthorized: function (request, response, next) {
      //de andra 2 logsen sker inte under funktionsanropet

      if (request.session.accountId == null) {

        console.log("middleware redirects to login")
=======
exports.isAuthorized = function(request, response, next){
    //de andra 2 logsen sker inte under funktionsanropet
  
    if(request.session.accountId == null){
        
>>>>>>> 523913bb1befbfae22a50d115a1dae171842ed5f
        response.redirect('/accounts/login/?unAuthorized=true')
      }
      else {
        next()
      }

    }
  }
}