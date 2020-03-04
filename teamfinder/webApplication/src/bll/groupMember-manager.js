
module.exports = function ({ groupMemberRepository, groupManager }) {

    return {
        createGroupMemberLink: function (account, group, callback) {
            const validationErrors = groupManager.validateRequirements(account, group)
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

        removeGroupMemberLink: function (accountId, groupId, callback) {
            groupMemberRepository.removeGroupMemberLink(accountId, groupId, callback)
        }

    }
}