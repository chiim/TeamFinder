
module.exports = function ({ dbMySQL }) {
    return {

        createGroupMemberLink: function (accountId, groupId, callback) {
            const query = "INSERT INTO GroupMembers (accountId, groupId) VALUES (?, ?)"
            const values = [accountId, groupId]
            dbMySQL.query(query, values, function (error, result) {
                if (error) {
                    console.log(error)
                    const databaseError = "DatabaseError: Error linking account to group."
                    callback(databaseError)
                }
                else {
                    callback(null)
                }
            })
        },

        getNrOfMembersInGroup: function (groupId, callback) {
            const query = "UPDATE Groups SET nrOfMembers = (SELECT COUNT(accountId) FROM GroupMembers WHERE groupId = ?) WHERE groupId = ?"
            const values = [groupId, groupId]

            dbMySQL.query(query, values, function (error, result) {
                if (error) {
                    console.log(error)
                    const databaseError = "DatabaseError: Error updating number of members"
                    callback(databaseError)
                }
                callback(null)

            })
        },

        getGroupMembers: function (groupId, callback) {
            const query = "SELECT accountId FROM GroupMembers WHERE groupId = ?"
            const values = [groupId]

            dbMySQL.query(query, values, function (error, result) {
                if (error) {
                    console.log(error)
                    const databaseError = "DatabaseError: Error fetching group members"
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
                    const databaseError = "DatabaseError: Error when kicking member"
                    callback(databaseError)
                }
                else {
                    callback(null)
                }
            })


        }
    }
}