
module.exports = function ({groupRepository, validator}) {

    return {

        createGroup: function (groupCredentials, callback) {

            const validationErrors = validator.validateGroup(groupCredentials)

            if (validationErrors.length > 0) {
                callback(validationErrors, null)
            }

            else {
                groupRepository.createGroup(groupCredentials, callback)
            }
        },

        getAllGroups: function (callback) {

            groupRepository.getAllGroups(callback)

        },

        getActiveGroupIds: function (accountId, callback) {
            groupRepository.getActiveGroupIds(accountId, callback)
        },

        getAllGroupIds: function (callback) {
            groupRepository.getAllGroupIds(callback)
        },

        getGroupById: function (id, callback) {

            groupRepository.getGroupById(id, callback)

        },

        deleteGroupById: function (id, callback) {

            groupRepository.deleteGroupById(id, callback)

        },

        updateGroup: function (group, callback) {
            const errors = validator.validateGroup(group)
            if (errors.length > 0) {
                callback(errors, null)
            }
            else {
                groupRepository.updateGroup(group, callback)
            }
        },

        validateRequirements: function(account, group){
            return validator.validateRequirements(account, group)
        }
        
    }
}