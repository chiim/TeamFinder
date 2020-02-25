module.exports = function ({ dbPostgres }) {

    const dbAccount = dbPostgres.Account
    return {

        createAccount: function (account, callback) {

            dbAccount.create({
                firstname: account.firstName,
                lastname: account.lastName,
                email: account.email,
                password: account.password,
                age: account.age,
                city: account.city,
                gender: account.gender
            }).then(function (createdAccount) {
                callback(null, createdAccount)
            }).catch(function (error) {
                console.log(error)
                const databaseError = "Something went wrong inserting data. Contact admin."
                callback(databaseError, null)
            })
        },

        getAccountById: function (accountId, callback) {

            dbAccount.findById(accountId).then(function (account) {
                callback(null, account[0])
            }).catch(function (error) {
                console.log(error)
                const databaseError = "Something went wrong inserting data. Contact admin."
                callback(databaseError, null)
            })
        },

        updateAccount: function (account, callback) {
            dbAccount.update({
                firstName: account.firstName,
                lastName: account.lastName,
                email: account.email,
                age: account.age,
                city: account.city,
                gender: account.gender,
            }, {
                where: { accountId: account.accoundId }
            }).then(function () {
                callback(null)
            }).catch(function (error) {
                console.log(error)
                const databaseError = "error when updating account"
                callback(databaseError)
            })
        },

        loginAccount: function (email, callback) {
            dbAccount.findOne({
                where: { email: email }
            }).then(function (account) {
                if (account.length == 0) {
                    databaseError = "no result found"
                    callback(databaseError, null)
                }
                else {
                    callback(null, account[0])
                }
            }).catch(function (error) {
                callback(error, null)
            })
        },

        deleteAccount: function (accountId, callback) {

            dbAccount.destroy({
                where: { id: accountId }
            }).then(function () {
                callback(null)
            }).catch(function (error) {
                console.log(error)
                const databaseError = "error when deleting account"
            })
        }
    }
}