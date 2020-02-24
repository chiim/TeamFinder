const bcrypt = require('bcrypt')

module.exports = function ({ accountRepository, validator }) {
    return {


        createAccount: function (account, callback) {

            //validering

            const errors = validator.validateAccount(account)
            const saltRounds = 10
            const password = account.password.toString()

            if (0 < errors.length) {
                callback(errors, null)
                return
            }


            bcrypt.hash(password, saltRounds, function (err, hash) {
                //här borde if error finnas
                accountRepository.createAccount(hash, account, callback)
            })
        },

        

        getAccountById: function (accountId, callback) {
            accountRepository.getAccountById(accountId, callback)
        },

        updateAccount: function (account, callback) {


            //validering

            const errors = []
            MAX_PASSWORD_LENGTH = 10
            MIN_PASSWORD_LENGTH = 2

            // Validate username.
            if (!account.hasOwnProperty("firstName")) {
                errors.push("firstNameMissing")
            } else if (!account.hasOwnProperty("lastName")) {
                errors.push("lastNameMissing")
            } else if (!account.hasOwnProperty("email")) {
                errors.push("emailMissing")
            } else if (!account.hasOwnProperty("age")) {
                errors.push("ageMissing")
            } else if (!account.hasOwnProperty("city")) {
                errors.push("cityMissing")
            } else if (!account.hasOwnProperty("gender")) {
                errors.push("genderMissing")
            }


            if (0 < errors.length) {

                callback(errors)
                return
            }

            accountRepository.updateAccount(account, callback)
        },

        loginAccount: function (email, password, callback) {

            accountRepository.loginAccount(email, function(error, account){
                if(error){
                    callback(error, null)
                }
                else{//FRÅGA LINUS
                    compareAccount(account, password, callback)
                    
                }
            })

        },

        deleteAccount: function (accountId, callback) {
            accountRepository.deleteAccount(accountId, callback)
        }
    }
}

const compareAccount = function (account, password, callback) {

    const hash = account.Password.toString()

    bcrypt.compare(password, hash, function (err, result) {

        if (result == true) {
            callback(null, account)
        }
        else {
            const dbError = "dbError logging in"
            callback(dbError, null)
        }
    })
}