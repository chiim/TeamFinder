
module.exports = function ({ groupMemberRepository }) {

    return {
        createGroupMemberLink: function (accountId, groupId, callback) {
            groupMemberRepository.createGroupMemberLink(accountId, groupId, callback)
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