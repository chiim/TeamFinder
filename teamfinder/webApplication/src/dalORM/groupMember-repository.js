
module.exports = function ({ dbPostgres }) {

    const GroupMember = dbPostgres.GroupMember
    const Group = dbPostgres.group
    return {

        createGroupMemberLink: function (accountId, groupId, callback) {
            const dbGroupMember = dbPostgres.model("groupMember")

            GroupMember.create({
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

        getNrOfMembersInGroup: function(groupId, callback) {

            const dbGroupMember = dbPostgres.model("groupMember")

            const { QueryTypes } = require('sequelize');

            Group.query("UPDATE Groups SET NrOfMembers = (SELECT COUNT(AccountId) FROM GroupMembers WHERE GroupId = ?) WHERE GroupId = ?", 
            {
                replacements: [groupId, groupId],
                type: QueryTypes.UPDATE
            }).then(function(){
                callback(null)
            }).catch(function(error){
                console.log(error)
                const databaseError = "Something went wrong updating groupMembers."
                callback(databaseError)
            })         

        },

        getGroupMembers: function(groupId, callback){

            const dbGroupMember = dbPostgres.model("groupMember")

            GroupMember.findAll({
                attributes: ['accountId'],
                where: {
                    groupId: groupId
                }
            }).then(function(accountIds){
                callback(null, accountIds)
            }).catch(function(error){
                console.log(error)
                const databaseError = "Something went wrong retreiving groupMembers."
                callback(databaseError, null)
            })
        },

        removeGroupMemberLink: function (accountId, groupId, callback){

            const dbGroupMember = dbPostgres.model("groupMember")

            GroupMember.destroy({
                where :{
                    accountId: accountId,
                    groupId: groupId
                }
            }).then(function(){
                callback(null)
            }).catch(function(error){
                console.log(error)
                const databaseError = "Something went wrong deleting groupMembers."
                callback(databaseError)
            })
        }


    }




}


