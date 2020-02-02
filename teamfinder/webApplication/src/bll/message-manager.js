const messageRepository = require('../dal/message-repository')

exports.createMessage = function(message, callback){

    //validation
    
    errors = []

    if(!message.hasOwnProperty("groupId")){
        errors.push("groupId missing")
    }else if(!message.hasOwnProperty("accountId")){
        errors.push("accountId missing")
    }else if(!message.hasOwnProperty("text")){
        errors.push("text missing")
    }else if(!message.hasOwnProperty("authorName")){
        errors.push("authorName missing")
    }

    if(0 < errors.length){
        console.log(errors)
        callback(errors)
        return
    }

    messageRepository.createMessage(message, callback)

}