const accountRepository = require('../dal/account-repository')

exports.createAccount = function(account, callback){

    //validering

    const errors = []
    MAX_PASSWORD_LENGTH = 10
    MIN_PASSWORD_LENGTH = 2
	
	// Validate username.
	if(!account.hasOwnProperty("firstName")){
		errors.push("firstNameMissing")
	}else if(!account.hasOwnProperty("lastname")){
        errors.push("lastNameMissing")
    }else if(!account.hasOwnProperty("email")){
        errors.push("emailMissing")
    }else if(!account.hasOwnProperty("age")){
        errors.push("ageMissing")
    }else if(!account.hasOwnProperty("city")){
        errors.push("cityMissing")
    }else if(!account.hasOwnProperty("phoneNr")){
        errors.push("phoneNrMissing")
    }else if(!account.hasOwnProperty("password")){
        errors.push("passwordMissing")
    }else if(account.password.length < MIN_PASSWORD_LENGTH){
		errors.push("passwordTooShort")
	}else if(MAX_PASSWORD_LENGTH < account.password.length){
		errors.push("passwordTooLong")
	}
    
    
    if (0 < errors.length) {
        callback(errors, null)
    }

    accountRepository.createAccount(account, callback)
}