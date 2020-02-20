const accountRepository = require('../dal/account-repository')
const bcrypt = require('bcrypt')
const validator = require('../bll/validator')

exports.createAccount = function(account, callback){

    //validering

    const errors = validator.validateAccount(account)    
    const saltRounds = 10
    const password = account.password.toString()

    if (0 < errors.length) {
        callback(errors, null)
        return
    }    


    bcrypt.hash(password, saltRounds, function(err, hash) {
        //här borde if error finnas
        accountRepository.createAccount(hash, account, callback)
    })
}

exports.compareAccount = function(account, password, callback){

    const hash = account.Password.toString()

    bcrypt.compare(password, hash, function(err, result) {
        console.log(err)

        if(result == true){
            callback(null , account)
        }
        else{
            const dbError = "dbError logging in"
            console.log("error i compare hash")
            callback(dbError, null)
        }
    })
}

exports.getAccountById = function(accountId, callback){
    accountRepository.getAccountById(accountId, callback)
}

exports.updateAccount = function(account, callback){

    const errors = validator.updateAccount(account)
    

    if (0 < errors.length) {

        callback(errors)
        return
    }

    accountRepository.updateAccount(account, callback)

}

exports.loginAccount = function(email, password, callback){

    accountRepository.loginAccount(email, password, callback)

}

exports.deleteAccount = function(accountId, callback){
    accountRepository.deleteAccount(accountId, callback)
}