const mySql = require('mysql')
const db = require('./dbConnection')



exports.createAccount = function(account, callback){

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

    db.query(query, values, function(error, result){
        if(error){
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

exports.loginAccount = function(credentials, callback){

    const query = "SELECT * FROM Accounts WHERE Email = ? AND Password = ? LIMIT 1"
    const values = [
        credentials.email,
        credentials.password
    ]

    db.query(query, values, function(error, account){

        if(error){
            callback(error, null)
        }else if(account.length == 0){
            dbError = "no result found"
            callback(dbError, null)
        }
        else{
            callback(null, account[0])
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