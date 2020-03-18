
module.exports = function ({ groupMemberRepository, groupManager }) {

    return {
        createGroupMemberLink: function (account, group, callback) {
            const validationErrors = groupManager.validateRequirements(account, group)
            console.log("validationErrors: ", validationErrors)
            if (validationErrors.length > 0) {
                callback(validationErrors)
            }
            else {
                groupMemberRepository.createGroupMemberLink(account.accountId, group.groupId, callback)
            }
        },

        getNrOfMembersInGroup: function (groupId, callback) {
            groupMemberRepository.getNrOfMembersInGroup(groupId, callback)
        },

        getGroupMembers: function (groupId, callback) {
            groupMemberRepository.getGroupMembers(groupId, callback)
        },

        removeGroupMemberLink: function (accountId, group, callback) {
            if(accountId == group.authorId){
                const error = "The group owner can't be removed from a group"
                callback(error)
            }
            else{
                groupMemberRepository.removeGroupMemberLink(accountId, group.groupId, callback)
            }
        }

    }
}