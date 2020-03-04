const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const csrf = require('csurf')
const redis = require('redis')
const redisStore = require('connect-redis')(session)


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
const dbPostgres = require('./dalORM/dbConnection')
const initPostgres = require('./dalORM/initPostgres')

const apiAccountRouter = require('./pl-api/account-router')
const apiGroupRouter = require('./pl-api/group-router')
const apiMessageRouter = require('./pl-api/message-router')

const awilix = require('awilix')
const container = awilix.createContainer()

container.register('groupRepository', awilix.asFunction(groupRepository))
container.register('groupManager', awilix.asFunction(groupManager))
container.register('groupRouter', awilix.asFunction(groupRouter))
container.register('groupMemberRepository', awilix.asFunction(groupMemberRepository))
container.register('groupMemberManager', awilix.asFunction(groupMemberManager))

container.register('accountRepository', awilix.asFunction(accountRepository))
container.register('accountManager', awilix.asFunction(accountManager))
container.register('accountRouter', awilix.asFunction(accountRouter))
container.register('middleware', awilix.asFunction(middlewareRouter))

container.register('validator', awilix.asFunction(validator))

container.register('messageRepository', awilix.asFunction(messageRepository))
container.register('messageManager', awilix.asFunction(messageManager))
container.register('messageRouter', awilix.asFunction(messageRouter))

container.register('initPostgres', awilix.asFunction(initPostgres))
container.register('dbPostgres', awilix.asFunction(dbPostgres))

container.register('apiAccountRouter', awilix.asFunction(apiAccountRouter))
container.register('apiGroupRouter', awilix.asFunction(apiGroupRouter))
container.register('apiMessageRouter', awilix.asFunction(apiMessageRouter))

/*container.register('dbMessage', awilix.asValue(db.Message))
container.register('dbAccount', awilix.asValue(db.Account))
container.register('dbGroupMember', awilix.asValue(db.GroupMember))
container.register('dbGroup', awilix.asValue(db.Group))*/


//container.register('express', awilix.asFunction(express))
container.register('dbMySQL', awilix.asFunction(dbMySQL))

const theAccountRouter = container.resolve('accountRouter')
const theGroupRouter = container.resolve('groupRouter')
const theMessageRouter = container.resolve('messageRouter')

const theApiAccountRouter = container.resolve('apiAccountRouter')
const theApiGroupRouter = container.resolve('apiGroupRouter')
const theApiMessageRouter = container.resolve('apiMessageRouter')

const client = redis.createClient({
  host: 'redis'
})

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

app.use('/groups', theGroupRouter)
app.use('/accounts', theAccountRouter)
app.use('/messages', theMessageRouter)

app.use('/pl-api/groups', theApiGroupRouter)
app.use('/pl-api/accounts', theApiAccountRouter)
app.use('/pl-api/messages', theApiMessageRouter)

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

app.get('/', function(request, response){
  const error = request.query.error
  if(error){
    const logoutError = "There was an error logging out. Please try again"
    const model = {
      logoutError
    }
    response.render('home.hbs', model)
  }
  else{
    response.render("home.hbs")
  }
})


app.listen(8080)