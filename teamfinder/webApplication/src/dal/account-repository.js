const mySql = require('mysql')
const dbPostgres = require('./dbConnection')

module.exports = function ({ dbMySQL }) {
    return {
        createAccount: function (hash, account, callback) {

            const query = "INSERT INTO Accounts (firstName, lastName, email, password, age, city, gender) VALUES (?, ?, ?, ?, ?, ?, ?)"

            const values = [
                account.firstName,
                account.lastName,
                account.email,
                hash,
                account.age,
                account.city,
                account.gender
            ]

            dbMySQL.query(query, values, function (error, result) {
                if (error) {
                    console.log(error)
                    const databaseError = ["DatabaseError: Something went wrong inserting data. Contact admin."]
                    callback(databaseError, null)
                }
                else {
                    callback(null, result)
                }
            })

        },

        isEmailUnique: function (email, callback) {

            const query = "SELECT * FROM Accounts WHERE email = ?"
            const values = [email]

            dbMySQL.query(query, values, function (error, emailFound) {
                if (error) {
                    console.log(error)
                    const databaseError = ["DatabaseError: Something went wrong inserting data. Contact admin."]
                    callback(databaseError, null)
                } else {
                    var emailAvailable = false
                    console.log("RÄKNAAAAAAAAAAAAAAAAAAAAAAAA", emailFound)
                    if (emailFound.length == 0) {
                        emailAvailable = true
                    }
                    callback(null, emailAvailable)
                }
            })
        },

        getAccountById: function (accountId, callback) {
            const query = "Select * FROM Accounts WHERE accountId = ? LIMIT 1"
            const values = [accountId]
            dbMySQL.query(query, values, function (error, account) {

                if (error) {
                    console.log(error)
                    const databaseError = ["DatabaseError: Something went wrong retreiving data. Contact admin."]
                    callback(databaseError, null)
                }
                else {
                    callback(null, account[0])
                }

            })

        },

        updateAccount: function (account, callback) {

            const query = "UPDATE Accounts SET firstName = ?, lastName = ?, email = ?, age = ?, city = ?, gender = ? WHERE accountId = ?"

            const values = [
                account.firstName,
                account.lastName,
                account.email,
                account.age,
                account.city,
                account.gender,
                account.accountId
            ]

            dbMySQL.query(query, values, function (error) {

                if (error) {
                    console.log(error)
                    const databaseError = ["DatabaseError: error when updating account"]
                    callback(databaseError)
                }
                else {
                    callback(null)
                }
            })
        },

        loginAccount: function (email, callback) {

            const query = "SELECT * FROM Accounts WHERE email = ? LIMIT 1"
            const values = [
                email
            ]

            dbMySQL.query(query, values, function (error, account) {

                if (error) {
                    console.log(error)
                    const dbError = ["error when retrieving account"]
                    callback(dbError, null)
                } else if (account.length == 0) {
                    const databaseError = ["DatabaseError: no result found"]
                    callback(databaseError, null)
                }
                else {
                    callback(null, account[0])
                }

            })

        },

        deleteAccount: function (accountId, callback) {

            const query = "DELETE FROM Accounts WHERE accountId = ?"
            const values = [
                accountId
            ]
            dbMySQL.query(query, values, function (error) {

                if (error) {
                    console.log(error)
                    const databaseError = ["DatabaseError: error when deleting account"]
                    callback(databaseError)

                }
                else {
                    callback(null)
                }
            })
        }


    }
}