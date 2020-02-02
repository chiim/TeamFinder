const db = require('./dbConnection')

exports.createGroupMemberLink = function(accountId, groupId, callback){
    const query = "INSERT INTO GroupMembers (AccountId, GroupId) VALUES (?, ?)"
    const values = [accountId, groupId]

    db.query(query, values, function(error, result){
        if(error){
            const databaseError = "Error linking account to group."
            callback(databaseError)
        }
        else{
            callback(null)
        }
    })
}