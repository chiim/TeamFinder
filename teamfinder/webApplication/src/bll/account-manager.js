const bcrypt = require('bcrypt')

module.exports = function ({ accountRepository, validator }) {
    return {


        createAccount: function (account, callback) {

            const errors = validator.validateAccount(account)
            const saltRounds = 10

            accountRepository.isEmailUnique(account.email, function (error, emailAvailable) {
                
                if (error) {
                    callback(error, null)
                }
                else {
                    if (!emailAvailable) {
                        errors.push("email already exists")
                    }
                    if (0 < errors.length) {

                        callback(errors, null)
                        return
                    }
                    if (account.googleId) {
                        accountRepository.createAccount(null, account, callback)
                    }
                    else {
                        const password = account.password
                        bcrypt.hash(password, saltRounds, function (error, hash) {

                            if (error) {
                                console.log(error)
                                const hashError = ["error when creating account"]
                                callback(hashError, null)
                            } else {
                                accountRepository.createAccount(hash, account, callback)
                            }
                        })
                    }
                }

            })
        },

        getAccountById: function (accountId, callback) {
            accountRepository.getAccountById(accountId, callback)
        },

        updateAccount: function (account, callback) {

            const errors = []

            errors = validator.validateAccountUpdate(account)

            if (0 < errors.length) {

                callback(errors)
                return
            }
            accountRepository.updateAccount(account, callback)

        },

        loginAccount: function (email, password, callback) {

            accountRepository.loginAccount(email, function (error, account) {
                if (error) {
                    callback(error, null)
                }
                else {
                    compareAccount(account, password, callback)
                }
            })

        },

        deleteAccount: function (accountId, callback) {
            accountRepository.deleteAccount(accountId, callback)
        },

        getAccountByGoogleId: function (googleId, callback) {
            accountRepository.getAccountByGoogleId(googleId, callback)
        }
    }
}

const compareAccount = function (account, password, callback) {

    const hash = account.password

    bcrypt.compare(password, hash, function (err, result) {

        if (result == true) {
            callback(null, account)
        }
        else {
            const dbError = ["wrong credentials"]
            callback(dbError, null)
        }
    })
}