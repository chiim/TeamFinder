const groupMemberRepository = require('../dal/groupMember-repository')


exports.createGroupMemberLink = function(accountId, groupId, callback){

    groupMemberRepository.createGroupMemberLink(accountId, groupId, callback)

}

exports.getNrOfMembersInGroup = function(groupId, callback){
    groupMemberRepository.getNrOfMembersInGroup(groupId, callback)
}

exports.getGroupMembers = function(groupId, callback){
    groupMemberRepository.getGroupMembers(groupId, function(error, accountIds){
        if(error){
            
        }
    })


}