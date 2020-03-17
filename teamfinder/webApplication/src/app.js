const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const csrf = require('csurf')
const redis = require('redis')
const redisStore = require('connect-redis')(session)

const groupRepositoryMySQL = require('./dal/group-repository')
const accountRepositoryMySQL = require('./dal/account-repository')
const messageRepositoryMySQL = require('./dal/message-repository')
const groupMemberRepositoryMySQL = require('./dal/groupMember-repository')

const groupRepository = require('./dalORM/group-repository')
const groupManager = require('./bll/group-manager')
const groupRouter = require('./pl/group-router')

const accountRepository = require('./dalORM/account-repository')
const accountManager = require('./bll/account-manager')
const accountRouter = require('./pl/account-router')

const messageRepository = require('./dalORM/message-repository')
const messageManager = require('./bll/message-manager')
const messageRouter = require('./pl/message-router')

const groupMemberRepository = require('./dalORM/groupMember-repository')
const groupMemberManager = require('./bll/groupMember-manager')

const middlewareRouter = require('./pl/middleware-router')
const validator = require('./bll/validator')
const dbMySQL = require('./dal/dbConnection')

const apiAccountRouter = require('./pl-api/account-router')
const apiGroupRouter = require('./pl-api/group-router')

const awilix = require('awilix')
const container = awilix.createContainer()


container.register('groupManager', awilix.asFunction(groupManager))
container.register('groupRouter', awilix.asFunction(groupRouter))
container.register('groupMemberManager', awilix.asFunction(groupMemberManager))

container.register('accountManager', awilix.asFunction(accountManager))
container.register('accountRouter', awilix.asFunction(accountRouter))
container.register('middleware', awilix.asFunction(middlewareRouter))

container.register('validator', awilix.asFunction(validator))

container.register('messageManager', awilix.asFunction(messageManager))
container.register('messageRouter', awilix.asFunction(messageRouter))

const mySql = false

if (mySql) {
  container.register('groupRepository', awilix.asFunction(groupRepositoryMySQL))
  container.register('groupMemberRepository', awilix.asFunction(groupMemberRepositoryMySQL))
  container.register('accountRepository', awilix.asFunction(accountRepositoryMySQL))
  container.register('messageRepository', awilix.asFunction(messageRepositoryMySQL))
  container.register('dbMySQL', awilix.asFunction(dbMySQL))
}
else{
  container.register('groupRepository', awilix.asFunction(groupRepository))
  container.register('groupMemberRepository', awilix.asFunction(groupMemberRepository))
  container.register('accountRepository', awilix.asFunction(accountRepository))
  container.register('messageRepository', awilix.asFunction(messageRepository))
}


container.register('apiAccountRouter', awilix.asFunction(apiAccountRouter))
container.register('apiGroupRouter', awilix.asFunction(apiGroupRouter))


const theAccountRouter = container.resolve('accountRouter')
const theGroupRouter = container.resolve('groupRouter')
const theMessageRouter = container.resolve('messageRouter')

const theApiAccountRouter = container.resolve('apiAccountRouter')
const theApiGroupRouter = container.resolve('apiGroupRouter')

const client = redis.createClient({
  host: 'redis'
})

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))



app.use(cookieParser())

app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: 'sadjkfasblowihnmdhu',
  accountId: null,
  store: new redisStore({
    host: 'redis', // Your current docker IP (?)
    port: 6379,
    client: client
  })
}))




app.set("views", "src/pl/views")

app.use(function (request, response, next) {
  response.locals.accountId = request.session.accountId
  next()
})

// app.use(function(request, response, next){
// 	response.setHeader("Access-Control-Allow-Origin", "*")
// 	response.setHeader("Access-Control-Allow-Methods", "*")
// 	response.setHeader("Access-Control-Allow-Headers", "*")
// 	response.setHeader("Access-Control-Expose-Headers", "*")
// 	next()
// })

 // We use middleware instead of specifying links below because we use different docker versions making this a simpler solution for us
 // Could otherwise keep it in an app.use() and replace "*" with localhost:8080 (or 192.168.99.100:8080)
accessControl = function(request, response, next){
  response.setHeader("Access-Control-Allow-Origin", "*") 
  response.setHeader("Access-Control-Allow-Methods", "*")
  response.setHeader("Access-Control-Allow-Headers", "*")
  response.setHeader("Access-Control-Expose-Headers", "*")
  next()
}


app.use('/groups', csrf({ cookie: true }), theGroupRouter)
app.use('/accounts', csrf({ cookie: true }), theAccountRouter)
app.use('/messages', csrf({ cookie: true }), theMessageRouter)

app.use('/pl-api/groups', accessControl, theApiGroupRouter)
app.use('/pl-api/accounts', accessControl, theApiAccountRouter)

// app.use("/groups", groupRouter)
// app.use("/accounts", accountRouter)
// app.use("/messages", messageRouter)

var hbs = expressHandlebars.create({
  helpers: {
    // function used in manageMembers.hbs
    isAuthor: function (accountId, authorId) {
      if (accountId == authorId) {
        return true
      }
      return false
    }
  },
  defaultLayout: "main.hbs"
})

app.engine('hbs', hbs.engine)

app.use(express.static(__dirname + "/pl/public/css"))
app.use(express.static(__dirname + "/pl/public/images"))

app.get('/', function (request, response) {
  const error = request.query.error
  if (error) {
    const logoutError = "There was an error logging out. Please try again"
    const model = {
      logoutError
    }
    response.render('home.hbs', model)
  }
  else {
    response.render("home.hbs")
  }
})


app.listen(8080)