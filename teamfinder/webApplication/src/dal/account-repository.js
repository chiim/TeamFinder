const mySql = require('mysql')
const db = require('./dbConnection')



exports.createAccount = function(account, callback){

    console.log("repository")

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
            console.log("db error")
            console.log(error)
            const databaseError = ["Something went wrong inserting data. Contact admin."]
            callback(databaseError, null)
        }
        else{
            console.log("inga db errors")
            callback(null, result)
        }
    })

}

exports.getAccountById = function(accountId, callback){

    const query = "Select * FROM Accounts WHERE AccountId = ? LIMIT 1"
    const values = [accountId]

    db.query(query, values, function(error, account){

        if(error){
            console.log(error)
            const databaseError = ["Something went wrong inserting data. Contact admin."]
            callback(databaseError, null)
        }
        else{
            console.log("inga dbErrors")
            callback(null, account[0])//ful lösning?
        }

    })

}