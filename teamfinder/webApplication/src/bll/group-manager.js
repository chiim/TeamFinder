const groupRepository = require('../dal/group-repository')
const validator = require("../bll/validator")

exports.createGroup = function (groupCredentials, callback) {

    const validationErrors = validator.validateGroup(groupCredentials)

    if (validationErrors.length > 0) {
        callback(validationErrors, null)
    }

    else {
        groupRepository.createGroup(groupCredentials, callback)
    }
}

exports.getAllGroups = function(callback){

    groupRepository.getAllGroups(callback)

}

exports.getActiveGroups = function(accountId, callback){
    groupRepository.getActiveGroups(accountId, callback)
}

exports.getAllGroupIds = function(callback){
    groupRepository.getAllGroupIds(callback)
}

exports.getGroupById = function(id, callback){

    groupRepository.getGroupById(id, callback)

}

exports.updateGroup = function(group, callback){
    const errors = validator.validateGroup(group)
    if(errors > 0){
        callback(errors, null)
    }
    else{
        groupRepository.updateGroup(group, callback)
    }
}