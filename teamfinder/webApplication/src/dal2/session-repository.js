accountDb = require('../dal/account-repository')

//TEMPORARY. NEEDS TO BE THE RIGHT CLIENT LATER
client = require('redis').createClient()

exports.insertSessionId = function(accountId, sessionId, callback){

    //Store sessionId using the accountId. This is always checked when logging in.
    client.set(accountId, sessionId)

    callback(null) // DO I even need a callback here?
}

exports.getSessionId = function(accountId, callback){

    const sessionId = client.get(accountId)

    if(sessionId){
        callback(null, sessionId)
    }
    else{
        const databaseError = "Your account doesn't exist. Stop trying to hack the website!"
        callback(databaseError, null)
    }

}