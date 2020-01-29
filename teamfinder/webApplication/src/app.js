const express = require('express')
const expressHandlebars = require('express-handlebars')

const groupRouter = require('./pl/group-router')
const accountRouter = require('./pl/account-router')
const groupMemberRouter = require('./pl/groupMember-router')
const messageRouter = require('./pl/message-router')


const app = express()

app.set("views", "src/pl/views")

app.use("/groups", groupRouter)
app.use("/accounts", accountRouter)
app.use("/groupMembers", groupMemberRouter)
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