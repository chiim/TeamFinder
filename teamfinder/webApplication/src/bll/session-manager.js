sessionRepository = require('../dal2/session-repository')

exports.insertSessionId = function(accountId, sessionId, callback){
    sessionRepository.insertSessionId(accountId, sessionId, callback)
}

exports.getSessionId = function(accountId, callback){
    sessionRepository.getSessionId(accountId, callback)
}