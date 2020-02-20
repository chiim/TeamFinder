
module.exports = function ({ }) {
  return {
    isAuthorized: function (request, response, next) {
      //de andra 2 logsen sker inte under funktionsanropet

      if (request.session.accountId == null) {

        console.log("middleware redirects to login")
        response.redirect('/accounts/login/?unAuthorized=true')
      }
      else {
        next()
      }

    }
  }
}