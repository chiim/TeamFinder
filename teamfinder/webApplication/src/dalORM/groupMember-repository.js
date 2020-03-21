const dbPostgres = require('../dalORM/dbConnection')

module.exports = function () {

    return {

        createGroupMemberLink: function (accountId, groupId, callback) {
            const dbGroupMember = dbPostgres.model("groupMember")
            console.log("AccountId: " + accountId + ". GroupId: " + groupId)
            dbGroupMember.create({
                accountId: accountId,
                groupId: groupId
            }).then(function () {
                console.log("Then funkar")
                callback(null)
                return
            }).catch(function (error) {
                    const databaseError = "DatabaseError: You're already part of the group"
                    console.log("Database error logged here: ", databaseError)
                    console.log("Error from catch logged here: ", error)
                    callback(databaseError)
            })
        },

        getNrOfMembersInGroup: function (groupId, callback) {

            const dbGroupMember = dbPostgres.model("groupMember")
            const dbGroup = dbPostgres.model("group")

            dbGroupMember.count({
                where: {
                    groupId: groupId
                }
            }).then(function (numberOfMembers) {

                dbGroup.update({
                    nrOfMembers: numberOfMembers
                }, {
                    where: {
                        groupId: groupId
                    }
                }).then(function () {
                    
                    callback(null, numberOfMembers)
                }).catch(function (error) {
                    console.log(error)
                    const databaseError = "DatabaseError: Something went wrong updating groupMembers. inside update"
                    callback(databaseError, null)
                })

            }).catch(function (error) {
                console.log(error)
                const databaseError = "DatabaseError: Something went wrong updating groupMembers. with count"
                callback(databaseError, null)
            })

            /*

            dbPostgres.query("UPDATE groups SET nrOfMembers = (SELECT COUNT(accountId) FROM groupMembers WHERE groupMembers.groupId = ?) WHERE groups.groupId = ?",
                {
                    
                    replacements: [groupId, groupId],
                    type: dbPostgres.QueryTypes.UPDATE,
                    literal: true
                }).then(function () {

                    callback(null)
                }).catch(function (error) {
                    console.log(error)
                    const databaseError = "Something went wrong updating groupMembers."
                    callback(databaseError)
                })

                */

        },

        getGroupMembers: function (groupId, callback) {

            const dbGroupMember = dbPostgres.model("groupMember")

            dbGroupMember.findAll({
                attributes: ['accountId'],
                where: {
                    groupId: groupId
                },
                raw: true
            }).then(function (accountIds) {
                callback(null, accountIds)
            }).catch(function (error) {
                console.log(error)
                const databaseError = "DatabaseError: Something went wrong retreiving groupMembers."
                callback(databaseError, null)
            })
        },

        removeGroupMemberLink: function (accountId, groupId, callback) {

            const dbGroupMember = dbPostgres.model("groupMember")

            dbGroupMember.destroy({
                where: {
                    accountId: accountId,
                    groupId: groupId
                }
            }).then(function () {
                callback(null)
            }).catch(function (error) {
                console.log(error)
                const databaseError = "DatabaseError: Something went wrong deleting groupMembers."
                callback(databaseError)
            })
        }


    }




}


