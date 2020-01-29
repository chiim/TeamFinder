const express = require('express')
const expressHandlebars = require('express-handlebars')

const groupRouter = require('./pl/groupRouter')

const app = express()

app.set("views", "src/pl/views")

app.use("/groups", groupRouter)
app.use("/accounts", accountRouter)

app.engine("hbs", expressHandlebars({
  defaultLayout: "main.hbs"
}))

app.use(express.static(__dirname + "/pl/public/css"))
app.use(express.static(__dirname + "/pl/public/images"))

app.get('/', function(request, response){
  response.render("home.hbs")
})

app.get('/login', function(request, response){
  response.render("login.hbs")
})

app.post('/login', function(request, response){
  response.redirect("/")
})

app.get('/register', function(request, response) {
  response.render("register.hbs")
})

app.listen(8080)