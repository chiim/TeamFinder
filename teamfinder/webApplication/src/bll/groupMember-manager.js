const groupMemberRepository = require('../dal/groupMember-repository')


exports.createGroupMemberLink = function(accountId, groupId, callback){

    groupMemberRepository.createGroupMemberLink(accountId, groupId, callback)

}

exports.getNrOfMembersInGroup = function(groupId, callback){
    groupMemberRepository.getNrOfMembersInGroup(groupId, callback)
}