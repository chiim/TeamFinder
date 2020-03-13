
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
            // Row below was used before implementing postgreSQL where we changed
            // the code so that we needed to return numberOfMembers if everything succeeded.
            //const query = "UPDATE Groups SET nrOfMembers = (SELECT COUNT(accountId) FROM GroupMembers WHERE groupId = ?) WHERE groupId = ?"
            //const values = [groupId, groupId]

            const query = "SELECT COUNT(accountId) as nrOfAccounts FROM GroupMembers WHERE groupId = ?"
            const values = [groupId]

            dbMySQL.query(query, values, function (error, numberOfMembers) {
                if (error) {
                    console.log(error)
                    const databaseError = "DatabaseError: Error updating number of members"
                    callback(databaseError, null)
                }
                else{
                    console.log(numberOfMembers[0].nrOfAccounts)
                    const query = "UPDATE Groups SET nrOfMembers = ? WHERE groupId = ?"
                    const values = [numberOfMembers[0].nrOfAccounts, groupId]
                    
                    dbMySQL.query(query, values, function (error) {
                        if (error) {
                            console.log(error)
                            const databaseError = "DatabaseError: Error updating number of members"
                            callback(databaseError, null)
                        }
                        else{
                            console.log(numberOfMembers[0].nrOfAccounts)
                            callback(null, numberOfMembers[0].nrOfAccounts)
                        }
                    })
                }
                

            })
        },

        getGroupMembers: function (groupId, callback) {
            const query = "SELECT accountId FROM GroupMembers WHERE groupId = ?"
            const values = [groupId]

            dbMySQL.query(query, values, function (error, accountIds) {
                if (error) {
                    console.log(error)
                    const databaseError = "DatabaseError: Error fetching group members"
                    callback(databaseError, null)
                }
                else {
                    callback(null, accountIds)
                }
            })
        },

        removeGroupMemberLink: function (accountId, groupId, callback) {

            const query = "DELETE FROM GroupMembers WHERE accountId = ? AND groupId = ?"
            const values = [accountId, groupId]

            dbMySQL.query(query, values, function (error) {
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