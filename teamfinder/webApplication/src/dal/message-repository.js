const mySql = require('mysql')
const db = require('./dbConnection')

exports.createMessage = function(message, callback){
    
    const query = "INSERT INTO Messages (GroupId, AccountId, Text, AuthorName) VALUES (?, ?, ?, ?)"

    const values = [
        message.groupId,
        message.accountId,
        message.text,
        message.authorName
    ]
    db.query(query, values, function(error, result){

        if(error){
            console.log(error)
            console.log("db error, createMessage")
            callback(error)
        }
        else{
            console.log("no db error, createMessage")
            callback(null)

        }
    })
}

exports.getAllMessagesByGroupId = function(groupId, callback){

    const query = "SELECT * FROM Messages WHERE GroupId = ?"
    const values = [groupId]

    db.query(query, values, function(error, messages){

        if(error){
            const databaseError = ["something went wrong getting messages from database"]
            callback(databaseError, null)
        }
        else{
            console.log("inga db errors vid hämtande av messages")
            callback(null, messages)
        }

    })

}