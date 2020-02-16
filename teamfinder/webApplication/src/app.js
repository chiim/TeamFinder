const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const csrf = require('csurf')
//const redis = require('redis')
//const redisStore = require('connect-redis')(session)


const groupRouter = require('./pl/group-router')
const accountRouter = require('./pl/account-router')
const messageRouter = require('./pl/message-router')

const app = express()

app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(cookieParser())

app.use(csrf({
    cookie: true
}))

app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: 'sadjkfasblowihnmdhu',
  accountId: null,
  /*store: new redisStore({
      host: '192.168.99.100', // Your current docker IP (?)
      port: 6379,
      client: redis,
  })*/
}))

app.set("views", "src/pl/views")

app.use(function (request, response, next) {
  response.locals.accountId = request.session.accountId
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
  response.render("home.hbs")
})


app.listen(8080)