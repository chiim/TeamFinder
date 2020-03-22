
module.exports = function () {
  return {
    isAuthorized: function (request, response, next) {

      if (request.session.accountId == null) {

        response.redirect('/accounts/login/?unAuthorized=true')
      }
      else {
        next()
      }

    }
  }
}