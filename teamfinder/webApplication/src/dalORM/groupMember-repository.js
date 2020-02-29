
module.exports = function ({ dbPostgres }) {

    return {

        createGroupMemberLink: function (accountId, groupId, callback) {
            const dbGroupMember = dbPostgres.model("groupMember")

            dbGroupMember.create({
                accountId: accountId,
                groupId: groupId
            }).then(function () {
                callback(null)
            }).catch(function (error) {
                console.log(error)
                const databaseError = "Something went wrong inserting data."
                callback(databaseError)
            })
        },

        getNrOfMembersInGroup: function (groupId, callback) {

            //const { QueryTypes } = require('sequelize');

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

                    callback(null)
                }).catch(function (error) {
                    console.log(error)
                    const databaseError = "Something went wrong updating groupMembers. inside update"
                    callback(databaseError)
                })

            }).catch(function (error) {
                console.log(error)
                const databaseError = "Something went wrong updating groupMembers. with count"
                callback(databaseError)
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
                const databaseError = "Something went wrong retreiving groupMembers."
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
                const databaseError = "Something went wrong deleting groupMembers."
                callback(databaseError)
            })
        }


    }




}


