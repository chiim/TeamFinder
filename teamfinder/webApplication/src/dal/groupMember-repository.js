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