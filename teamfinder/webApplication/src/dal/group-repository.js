
module.exports = function ({dbMySQL}) {
    //const db = require('./dbConnection')

    return {
        createGroup: function (groupCredentials, callback) {
            //const today = new Date()
            //date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()


            const query = "INSERT INTO Groups (`name`, image, sport, nrOfMembers, memberSlots, city, maxAge, minAge, skillLevel, allowedGender, authorId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"

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
                groupCredentials.accountId
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
            dbMySQL.query(query, function (error, groups) {
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

        getActiveGroupIds: function (accountId, callback) {
            const query = "SELECT groupId FROM GroupMembers WHERE accountId = ?"
            const values = [accountId]

            dbMySQL.query(query, values, function (error, activeGroupIds) {
                if (error) {
                    console.log(error)
                    const databaseError = "Something went wrong fetching active groups."
                    callback(databaseError, null)
                }
                else {
                    callback(null, activeGroupIds)
                }
            })

        },

        getAllGroupIds: function (callback) {
            const query = "SELECT groupId FROM Groups"
            dbMySQL.query(query, function (error, groupIds) {
                if (error) {
                    console.log(error)
                    const databaseError = "Something went wrong fetching a group"
                    callback(databaseError, null)
                }
                else {
                    callback(null, groupIds)
                }
            })
        }
        ,
        getGroupById: function (id, callback) {

            const query = "SELECT * FROM Groups WHERE groupId = ? LIMIT 1"
            const values = [id]
            dbMySQL.query(query, values, function (error, group) {
                if (error) {
                    console.log(error)
                    const databaseError = "Something went wrong fetching the group."
                    callback(databaseError, null)
                }
                else {
                    callback(null, group[0])
                }
            })

        },

        deleteGroupById: function (groupId, callback) {

            const query = "DELETE FROM Groups WHERE groupId = ?"
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

            // no where clause??

            const query = "UPDATE Groups SET image = ?, sport = ?, memberSlots = ?, city = ?, minAge = ?, maxAge = ?, skillLevel = ?, allowedGender = ? WHERE groupId = ?"
            const values = [
                group.image,
                group.sport,
                group.memberSlots,
                group.city,
                group.minAge,
                group.maxAge,
                group.skillLevel,
                group.gender,
                group.groupId
            ]

            dbMySQL.query(query, values, function (error, updatedGroup) {
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