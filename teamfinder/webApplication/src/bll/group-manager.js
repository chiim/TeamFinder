
module.exports = function ({ groupRepository, validator, accountManager }) {

    return {

        createGroup: function (groupCredentials, callback) {

            //why do we need to get account to create a group? we already have a account id in groupCredentials
            accountManager.getAccountById(groupCredentials.accountId, function (error, account) {
                if (error) {
                    callback(error, null)
                }
                else {
                    const validateAuthorErrors = validator.validateRequirements(account, groupCredentials)
                    const groupValidationErrors = validator.validateGroup(groupCredentials)
                    const validationErrors = validateAuthorErrors.concat(groupValidationErrors)
                    console.log(validationErrors)

                    groupRepository.isNameUnique(groupCredentials.name, function (error, nameAvailable) {

                        if (error) {
                            callback(error, null)
                        } else {
                            console.log(validationErrors)
                            if (!nameAvailable) {
                                validationErrors.push("name already exists")
                            }
                            if (validationErrors.length > 0) {
                                callback(validationErrors, null)
                            }
                            else {
                                groupRepository.createGroup(groupCredentials, callback)
                            }
                        }


                    })


                }
            })

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