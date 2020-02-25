const mySql = require('mysql')
const dbPostgres = require('./dbConnection')

module.exports = function ({ dbMySQL }) {
    return {
        createAccount: function (account, callback) {

            const query = "INSERT INTO Accounts (FirstName, LastName, Email, Password, Age, City, Gender) VALUES (?, ?, ?, ?, ?, ?, ?)"

            const values = [
                account.firstName,
                account.lastName,
                account.email,
                account.password,
                account.age,
                account.city,
                account.gender
            ]

            dbMySQL.query(query, values, function (error, result) {
                if (error) {
                    console.log(error)
                    const databaseError = ["Something went wrong inserting data. Contact admin."]
                    callback(databaseError, null)
                }
                else {
                    callback(null, result)
                }
            })

        },

        getAccountById: function (accountId, callback) {
            const query = "Select * FROM Accounts WHERE AccountId = ? LIMIT 1"
            const values = [accountId]
            dbMySQL.query(query, values, function (error, account) {

                if (error) {
                    console.log(error)
                    const databaseError = ["Something went wrong inserting data. Contact admin."]
                    callback(databaseError, null)
                }
                else {
                    callback(null, account[0])//ful lösning?
                }

            })

        },

        updateAccount: function (account, callback) {

            const query = "UPDATE Accounts SET FirstName = ?, LastName = ?, Email = ?, Age = ?, City = ?, Gender = ? WHERE AccountId = ?"

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
                    const databaseError = ["error when updating account"]
                    callback(databaseError)
                }
                else {
                    callback(null)
                }
            })
        },

        loginAccount: function (email, callback) {

            const query = "SELECT * FROM Accounts WHERE Email = ? LIMIT 1"
            const values = [
                email
            ]

            dbMySQL.query(query, values, function (error, account) {

                if (error) {
                    callback(error, null)
                } else if (account.length == 0) {
                    databaseError = "no result found"
                    callback(databaseError, null)
                }
                else {
                    callback(null, account[0])
                }

            })

        },

        deleteAccount: function (accountId, callback) {

            const query = "DELETE FROM Accounts WHERE AccountId = ?"
            const values = [
                accountId
            ]
            dbMySQL.query(query, values, function (error) {

                if (error) {
                    console.log(error)
                    const databaseError = "error when deleting account"
                    callback(databaseError)

                }
                else {
                    callback(null)
                }
            })
        }

        
    }
}