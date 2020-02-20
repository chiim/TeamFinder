
module.exports = function ({ accountRepository }) {
    return {
        createAccount: function (account, callback) {

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
            } else if (!account.hasOwnProperty("password")) {
                errors.push("passwordMissing")
            } else if (account.password.length < MIN_PASSWORD_LENGTH) {
                errors.push("passwordTooShort")
            } else if (MAX_PASSWORD_LENGTH < account.password.length) {
                errors.push("passwordTooLong")
            } else if (!account.hasOwnProperty("age")) {
                errors.push("ageMissing")
            } else if (!account.hasOwnProperty("city")) {
                errors.push("cityMissing")
            } else if (!account.hasOwnProperty("gender")) {
                errors.push("genderMissing")
            }


            if (0 < errors.length) {
                callback(errors, null)
                return
            }

            accountRepository.createAccount(account, callback)
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

        loginAccount: function (credentials, callback) {

            const errors = []

            if (!credentials.hasOwnProperty("email")) {
                errors.push("emailMissing")
            } else if (!credentials.hasOwnProperty("password")) {
                errors.push("passwordMissing")
            }

            if (0 < errors.length) {

                callback(errors, null)
                return
            }


            accountRepository.loginAccount(credentials, callback)


        },

        deleteAccount: function (accountId, callback) {
            accountRepository.deleteAccount(accountId, callback)
        }
    }
}