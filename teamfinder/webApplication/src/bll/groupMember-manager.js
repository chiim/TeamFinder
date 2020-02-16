const groupMemberRepository = require('../dal/groupMember-repository')


exports.createGroupMemberLink = function(accountId, groupId, callback){

    groupMemberRepository.createGroupMemberLink(accountId, groupId, callback)

}

exports.getNrOfMembersInGroup = function(groupId, callback){
    groupMemberRepository.getNrOfMembersInGroup(groupId, callback)
}

exports.getGroupMembers = function(groupId, callback){
    groupMemberRepository.getGroupMembers(groupId, callback)
}

exports.removeGroupMemberLink = function(accountId, groupId, callback){
    groupMemberRepository.removeGroupMemberLink(accountId, groupId, callback)
}