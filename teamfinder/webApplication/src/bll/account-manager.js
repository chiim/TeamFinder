const accountRepository = require('../dal/account-repository')

exports.createAccount = function(account, callback){

    //validering

    const errors = []
    MAX_PASSWORD_LENGTH = 10
    MIN_PASSWORD_LENGTH = 2
    
    console.log(account.firstName)
    console.log(account.password)
	// Validate username.
	if(!account.hasOwnProperty("firstName")){
		errors.push("firstNameMissing")
	}else if(!account.hasOwnProperty("lastName")){
        errors.push("lastNameMissing")
    }else if(!account.hasOwnProperty("email")){
        errors.push("emailMissing")
    }else if(!account.hasOwnProperty("password")){
        errors.push("passwordMissing")
    }else if(account.password.length < MIN_PASSWORD_LENGTH){
		errors.push("passwordTooShort")
	}else if(MAX_PASSWORD_LENGTH < account.password.length){
		errors.push("passwordTooLong")
	}else if(!account.hasOwnProperty("age")){
        errors.push("ageMissing")
    }else if(!account.hasOwnProperty("city")){
        errors.push("cityMissing")
    }else if(!account.hasOwnProperty("gender")){
        errors.push("genderMissing")
    }
    
    
    if (0 < errors.length) {
        console.log("error had length")
        callback(errors, null)
        return
    }

    accountRepository.createAccount(account, callback)
}

exports.getAccountById = function(accountId, callback){
    accountRepository.getAccountById(accountId, callback)
}