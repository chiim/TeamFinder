const express = require('express')
const expressHandlebars = require('express-handlebars')

const app = express()

app.set("views", "src/pl/views")

app.engine("hbs", expressHandlebars({
  defaultLayout: "main.hbs"
}))

app.use(express.static(__dirname + "/public"))

app.get('/', function(request, response){
  response.render("home.hbs")
})

app.listen(8080)