const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')

const groupRouter = require('./pl/group-router')
const accountRouter = require('./pl/account-router')
const messageRouter = require('./pl/message-router')

const app = express()

app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(session({
  saveUninitialized: false,
  resave: false, 
  secret: 'sadjkfasblowihnmdhu',
  accountId: null
}))

app.set("views", "src/pl/views")

app.use(function (request, response, next) {
  response.locals.accountId = request.session.accountId
  next()
})


app.use(function (request, response, next) {


  if (request.session.isLoggedIn == null){
    
    arrayOfPaths = [
      '/',
      '/groups/finder',//blocka denna posten
      '/account/login',
      '/account/sign-up',
    ]

    for(var i = 0; i < arrayOfPaths.length; i++){
      if(request.path){ 

      }
    }
  }

  next()

})

app.use("/groups", groupRouter)
app.use("/accounts", accountRouter)
app.use("/messages", messageRouter)

app.engine("hbs", expressHandlebars({
  defaultLayout: "main.hbs"
}))

app.use(express.static(__dirname + "/pl/public/css"))
app.use(express.static(__dirname + "/pl/public/images"))

app.get('/', function(request, response){

  /*const accountId = request.session.accountId

  console.log("account id som är inloggat :" + accountId)

  const model = {
    accountId
  }*/

  response.render("home.hbs")
})


app.listen(8080)