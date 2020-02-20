const mySql = require('mysql')
const db = require('./dbConnection')
const accountManager = require('../bll/account-manager')



exports.createAccount = function(hash, account, callback){

    const query = "INSERT INTO Accounts (FirstName, LastName, Email, Password, Age, City, Gender) VALUES (?, ?, ?, ?, ?, ?, ?)"

    const values = [
        account.firstName,
        account.lastName,
        account.email,
        hash,
        account.age,
        account.city,
        account.gender
    ] 

    db.query(query, values, function(error, result){
        if(error){
            console.log(error)
            const databaseError = ["Something went wrong inserting data. Contact admin."]
            callback(databaseError, null)
        }
        else{
            callback(null, result)
        }
    })

}

exports.getAccountById = function(accountId, callback){
    const query = "Select * FROM Accounts WHERE AccountId = ? LIMIT 1"
    const values = [accountId]

    db.query(query, values, function(error, account){

        if(error){
            const databaseError = ["Something went wrong inserting data. Contact admin."]
            callback(databaseError, null)
        }
        else{
            callback(null, account[0])//ful lösning?
        }

    })

}

exports.updateAccount = function(account, callback){

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

    db.query(query, values, function(error) {

        if(error){
            const databaseError = ["error when updating account"]
            callback(databaseError)
        }
        else{
            callback(null)
        }
    })
}

exports.loginAccount = function(email, password, callback){

    const query = "SELECT * FROM Accounts WHERE Email = ? LIMIT 1"
    const values = [
        email
    ]

    db.query(query, values, function(error, account){

        if(error){
            const dbError = "dbError logging in"
            callback(dbError, null)
        }else if(account.length == 0){
            
            const dbError = "no result found"
            callback(dbError, null)
        }
        else{
            accountManager.compareAccount(account[0], password, callback)
        }

    })

}

exports.deleteAccount = function(accountId, callback){

    const query = "DELETE FROM Accounts WHERE AccountId = ?"
    const values = [
        accountId
    ]
    db.query(query, values, function(error) {

        if(error){
            const databaseError = "error when deleting account"
            callback(databaseError)

        }
        else{
            callback(null)
        }
    })

}