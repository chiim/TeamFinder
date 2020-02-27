
module.exports = function ({dbMySQL}) {
    //const db = require('./dbConnection')

    return {
        createGroup: function (groupCredentials, callback) {
            //const today = new Date()
            //date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()


            const query = "INSERT INTO Groups (`Name`, Image, Sport, NrOfMembers, MemberSlots, City, MaxAge, MinAge, SkillLevel, AllowedGender, AuthorId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"

            const values = [
                groupCredentials.groupName,
                groupCredentials.image,
                groupCredentials.sport,
                groupCredentials.nrOfMembers,
                groupCredentials.memberSlots,
                groupCredentials.city,
                groupCredentials.minAge,
                groupCredentials.maxAge,
                groupCredentials.skillLevel,
                groupCredentials.allowedGender,
                accountId
            ]

            dbMySQL.query(query, values, function (error, result) {
                if (error) {
                    console.log(error)
                    const databaseError = "Something went wrong inserting data. Contact admin."
                    callback(databaseError, null)
                }
                else {
                    callback(null, result.insertId)
                }
            })

        },

        getAllGroups: function (callback) {
            const query = "SELECT * FROM Groups"
            dbMySQL.query(query, function (error, result) {
                if (error) {
                    console.log(error)
                    const databaseError = "Something went wrong fetching groups. Contact admin."
                    callback(databaseError, null)
                }
                else {
                    callback(null, groups)
                }
            })
        },

        getActiveGroups: function (accountId, callback) {
            const query = "SELECT GroupId FROM GroupMembers WHERE AccountId = ?"
            const values = [accountId]

            dbMySQL.query(query, values, function (error, result) {
                if (error) {
                    console.log(error)
                    const databaseError = "Something went wrong fetching active groups."
                    callback(databaseError, null)
                }
                else {
                    callback(null, result)
                }
            })

        },

        getAllGroupIds: function (callback) {
            const query = "SELECT GroupId FROM Groups"
            dbMySQL.query(query, function (error, result) {
                if (error) {
                    console.log(error)
                    const databaseError = "Something went wrong fetching a group"
                    callback(databaseError, null)
                }
                else {
                    callback(null, result)
                }
            })
        }
        ,
        getGroupById: function (id, callback) {

            const query = "SELECT * FROM Groups WHERE GroupId = ? LIMIT 1"
            const values = [id]
            dbMySQL.query(query, values, function (error, result) {
                if (error) {
                    console.log(error)
                    const databaseError = "Something went wrong fetching the group."
                    callback(databaseError, null)
                }
                else {
                    callback(null, result[0])
                }
            })

        },

        deleteGroupById: function (groupId, callback) {

            const query = "DELETE FROM Groups WHERE GroupId = ?"
            const values = [
                groupId
            ]

            dbMySQL.query(query, values, function (error) {

                if (error) {
                    console.log(error)
                    databaseError = "dbMySQL error when deleting group"
                    callback(databaseError)
                }
                else {
                    callback(null)
                }
            })
        },

        updateGroup: function (group, callback) {

            const query = "UPDATE Groups SET Image = ?, Sport = ?, MemberSlots = ?, City = ?, MinAge = ?, MaxAge = ?, SkillLevel = ?, AllowedGender = ?"
            const values = [
                group.image,
                group.sport,
                group.memberSlots,
                group.city,
                group.minAge,
                group.maxAge,
                group.skillLevel,
                group.gender
            ]

            dbMySQL.query(query, values, function (error, result) {
                if (error) {
                    console.log(error)
                    const databaseError = "Something went wrong when updating the group information"
                    callback(databaseError)
                }
                else {
                    callback(null)
                }
            })

        }
    }
}