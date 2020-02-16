const db = require('./dbConnection')

exports.createGroupMemberLink = function (accountId, groupId, callback) {
    const query = "INSERT INTO GroupMembers (AccountId, GroupId) VALUES (?, ?)"
    const values = [accountId, groupId]
    db.query(query, values, function (error, result) {
        if (error) {
            const databaseError = "Error linking account to group."
            callback(databaseError)
        }
        else {
            callback(null)
        }
    })
}

exports.getNrOfMembersInGroup = function (groupId, callback) {
    const query = "UPDATE Groups SET NrOfMembers = (SELECT COUNT(AccountId) FROM GroupMembers WHERE GroupId = ?) WHERE GroupId = ?"
    const values = [groupId, groupId]

    db.query(query, values, function (error, result) {
        if (error) {
            const databaseError = "Error updating number of members"
            callback(databaseError)
        }
        callback(null)

    })
}

exports.getGroupMembers = function(groupId,  callback){
    const query = "SELECT AccountId FROM GroupMembers WHERE GroupId = ?"    
    const values = [groupId]

    db.query(query, values, function(error, result){
        if(error){
            const databaseError = "Error fetching group members"
            callback(databaseError, null)
        }
        else{
            callback(null, result)
        }
    })
}

exports.removeGroupMemberLink = function(accountId, groupId, callback){

    const query = "DELETE FROM GroupMembers WHERE accountId = ? AND groupId = ?"
    const values = [accountId, groupId]

    db.query(query, values, function(error, result){
        if(error){
            const databaseError = "Error when kicking member"
            callback(databaseError)
        }
        else{
            callback(null)
        }
    })


}