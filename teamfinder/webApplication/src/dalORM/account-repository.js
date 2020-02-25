module.exports = function({ Account }){

    return{

        createAccount: function(account, callback){

            Account.create({
                Firstname: account.firstName,
                Lastname: account.lastName,
                Email: account.email,
                Password: account.password,
                Age: account.age,
                City: account.city,
                Gender: account.gender
            }).then(function(createdAccount){
                callback(null, createdAccount)
            }).catch(function(error){
                console.log(error)
                const databaseError = ["Something went wrong inserting data. Contact admin."]
                callback(databaseError, null)
            })

        }

    }

}