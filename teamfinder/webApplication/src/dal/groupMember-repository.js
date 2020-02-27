
module.exports = function ({ dbMySQL }) {
    return {

        createGroupMemberLink: function (accountId, groupId, callback) {
            const query = "INSERT INTO GroupMembers (AccountId, GroupId) VALUES (?, ?)"
            const values = [accountId, groupId]
            dbMySQL.query(query, values, function (error, result) {
                if (error) {
                    console.log(error)
                    const databaseError = "Error linking account to group."
                    callback(databaseError)
                }
                else {
                    callback(null)
                }
            })
        },

        getNrOfMembersInGroup: function (groupId, callback) {
            const query = "UPDATE Groups SET NrOfMembers = (SELECT COUNT(AccountId) FROM GroupMembers WHERE GroupId = ?) WHERE GroupId = ?"
            const values = [groupId, groupId]

            dbMySQL.query(query, values, function (error, result) {
                if (error) {
                    console.log(error)
                    const databaseError = "Error updating number of members"
                    callback(databaseError)
                }
                callback(null)

            })
        },

        getGroupMembers: function (groupId, callback) {
            const query = "SELECT AccountId FROM GroupMembers WHERE GroupId = ?"
            const values = [groupId]

            dbMySQL.query(query, values, function (error, result) {
                if (error) {
                    console.log(error)
                    const databaseError = "Error fetching group members"
                    callback(databaseError, null)
                }
                else {
                    callback(null, result)
                }
            })
        },

        removeGroupMemberLink: function (accountId, groupId, callback) {

            const query = "DELETE FROM GroupMembers WHERE accountId = ? AND groupId = ?"
            const values = [accountId, groupId]

            dbMySQL.query(query, values, function (error, result) {
                if (error) {
                    console.log(error)
                    const databaseError = "Error when kicking member"
                    callback(databaseError)
                }
                else {
                    callback(null)
                }
            })


        }
    }
}