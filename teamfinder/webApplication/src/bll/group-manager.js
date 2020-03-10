
module.exports = function ({ groupRepository, validator, accountManager }) {

    return {

        createGroup: function (groupCredentials, callback) {

            const groupValidationErrors = validator.validateGroup(groupCredentials)
            if (groupValidationErrors.length > 0) {
                callback(groupValidationErrors, null)
            }

            else {
                accountManager.getAccountById(groupCredentials.accountId, function (error, account) {
                    if (error) {
                        callback(error, null)
                    }
                    else {
                        const validateAuthorErrors = validator.validateRequirements(account, groupCredentials)
                        if (validateAuthorErrors.length > 0) {
                            const error = "The group requirements need to match your account info"
                            callback(error, null)
                        }
                        else {
                            groupRepository.createGroup(groupCredentials, callback)
                        }
                    }
                })
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
            console.log("group: ", group)
            if (errors.length > 0) {
                callback(errors, null)
            }
            else {
                groupRepository.updateGroup(group, callback)
            }
        },

        validateRequirements: function (account, group) {
            return validator.validateRequirements(account, group)
        }

    }
}