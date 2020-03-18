const dbPostgres = require('../dalORM/dbConnection')

module.exports = function () {

    return {

        createAccount: function (hash, account, callback) {
            const dbAccount = dbPostgres.model("account")
            dbAccount.create({
                firstName: account.firstName,
                lastName: account.lastName,
                email: account.email,
                password: hash,
                age: account.age,
                city: account.city,
                gender: account.gender
            }).then(function (createdAccount) {
                callback(null, createdAccount.dataValues.accountId)
            }).catch(function (error) {
                console.log(error)
                const databaseError = "DatabaseError: Something went wrong inserting data. Contact admin."
                callback(databaseError, null)
            })
        },

        isEmailIsUnique: function(email, callback){

            const dbAccount = dbPostgres.model("account")

            dbAccount.count({
                where : {
                    email :email
                }
            }).then(function(count){
                var emailAvailable
                if(count == 0){
                    emailAvailable = true
                    callback(emailAvailable)
                }else{
                    emailAvailable = false
                    callback(emailAvailable)
                }                
            }).catch(function(error){
                console.log(error)
                const databaseError = "DatabaseError: Something went wrong inserting data. Contact admin."
                callback(databaseError, null)
            })
        },

        getAccountById: function (accountId, callback) {
            const dbAccount = dbPostgres.model("account")

            dbAccount.findByPk(accountId, {raw: true}).then(function (account) {
                callback(null, account)
            }).catch(function (error) {
                console.log(error)
                const databaseError = "DatabaseError: Something went wrong inserting data. Contact admin."
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
                const databaseError = "DatabaseError: error when updating account"
                callback(databaseError)
            })
        },

        loginAccount: function (email, callback) {
            const dbAccount = dbPostgres.model("account")
            dbAccount.findOne({
                where: { email: email },
                raw: true
            }).then(function (account) {
                console.log("EYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY", account)
                
                if (account == null) {
                    error = "no result found"
                    callback(error, null)
                }
                else {
                    ("Account: ", account)
                    callback(null, account)
                }
            }).catch(function (error) {
                console.log(error)
                const databaseError = "DatabaseError: error when updating account"
                callback(databaseError, null)
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
                const databaseError = "DatabaseError: error when deleting account"
                callback(databaseError)
            })
        }
    }
}