const bcrypt = require('bcrypt')

module.exports = function ({ accountRepository, validator }) {
    return {


        createAccount: function (account, callback) {

            //validering

            const errors = validator.validateAccount(account)
            const saltRounds = 10
            const password = account.password.toString()



            if (!accountRepository.isEmailIsUnique(email, function (error, exist) {
                if (error) {

                }
                else if()

                }
                errors.push("email already exists")
            }

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

            console.log("Account in manager: ", account)
            //validering

            const errors = []
            MAX_PASSWORD_LENGTH = 15
            MIN_PASSWORD_LENGTH = 2
            MIN_NAME_LENGTH = 1
            MIN_EMAIL_LENGTH = 3
            MIN_AGE_LENGTH = 1
            MIN_CITY_LENGTH = 1

            // Validate username.
            if (account.firstName.length < MIN_NAME_LENGTH) {
                errors.push("firstNameMissing")
            } else if (account.lastName.length < MIN_NAME_LENGTH) {
                errors.push("lastNameMissing")
            } else if (account.email.length < MIN_EMAIL_LENGTH) {
                errors.push("emailMissing")
            } else if (!account.email.includes("@")) {
                errors.push("enter a valid email")
            } else if (account.age.length < MIN_AGE_LENGTH) {
                errors.push("ageMissing")
            } else if (account.city.length < MIN_CITY_LENGTH) {
                errors.push("cityMissing")
            } /*else if (!account.hasOwnProperty("gender")) {
                errors.push("genderMissing")
            }   THIS SHOULD BE ANY IF NOT FEMALE OR MALE ?
            */


            if (0 < errors.length) {

                callback(errors)
                return
            }
            accountRepository.updateAccount(account, callback)
            //} )){

            //}



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
        }
    }
}

const compareAccount = function (account, password, callback) {

    const hash = account.password.toString()

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