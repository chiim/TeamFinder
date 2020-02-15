const redis = require('redis')
const session = require('express-session')
const redisStore = require('connect-redis')(session)
const client = redis.createClient()


app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: 'sadjkfasblowihnmdhu',
    accountId: null,
    store: new redisStore({
        host: 'localhost', // Most likely docker-ip later
        port: 6379,
        client: client,
    })
}))




//INSERT

//client.set('sessionId', "session_stored_here")
// sessionId is NOT the secret. SessionId is a generated key.

//RETRIEVE

//client.get('session') // Retrieve the value of that key

//UPDATE

// client.set('session', 'newValue') // Overwrites the previos value

//DELETE
// client.del('session')

