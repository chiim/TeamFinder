module.exports = function ({ dbPostgres }) {

    return {

        createAccount: function (hash, account, callback) {
            const dbAccount = dbPostgres.model("account")
            console.log("ACCOUNT: ", account)
            dbAccount.create({
                firstName: account.firstName,
                lastName: account.lastName,
                email: account.email,
                password: hash,
                age: account.age,
                city: account.city,
                gender: account.gender
            }).then(function (createdAccount) {
                console.log("created account: ", createdAccount)
                callback(null, createdAccount)
            }).catch(function (error) {
                console.log(error)
                const databaseError = "Something went wrong inserting data. Contact admin."
                callback(databaseError, null)
            })
        },

        getAccountById: function (accountId, callback) {
            const dbAccount = dbPostgres.model("account")

            dbAccount.findByPk(accountId, {raw: true}).then(function (account) {
                callback(null, account)
            }).catch(function (error) {
                console.log(error)
                const databaseError = "Something went wrong inserting data. Contact admin."
                callback(databaseError, null)
            })
        },

        updateAccount: function (account, callback) {
            const dbAccount = dbPostgres.model("account")
            dbAccount.update({
                firstName: account.firstName,
                lastName: account.lastName,
                email: account.email,
                age: account.age,
                city: account.city,
                gender: account.gender
            }, {
                where: { 
                    accountId: account.accountId 
                }
            }).then(function () {
                callback(null)
            }).catch(function (error) {
                console.log(error)
                const databaseError = "error when updating account"
                callback(databaseError)
            })
        },

        loginAccount: function (email, callback) {
            const dbAccount = dbPostgres.model("account")
            dbAccount.findOne({
                where: { email: email },
                raw: true
            }).then(function (account) {
                
                if (account.length == 0) {
                    databaseError = "no result found"
                    callback(databaseError, null)
                }
                else {
                    console.log("Account: ", account)
                    callback(null, account)
                }
            }).catch(function (error) {
                callback(error, null)
            })
        },

        deleteAccount: function (accountId, callback) {
            const dbAccount = dbPostgres.model("account")

            dbAccount.destroy({
                where: { accountId: accountId }
            }).then(function () {
                callback(null)
            }).catch(function (error) {
                console.log(error)
                const databaseError = "error when deleting account"
                callback(databaseError)
            })
        }
    }
}