const mySql = require('mysql')
const db = require('./dbConnection')





exports.createGroup = function(groupCredentials, callback){

    const query = "INSERT INTO Groups (`name`, nrOfMembers, memberSlots, city, maxAge, minAge, skillLevel, allowedGender, publishingDate, authorId) VALUES ?"
    const values = [
        groupCredentials.groupName,
        groupCredentials.sport,
        groupCredentials.memberSlots,
        groupCredentials.city,
        groupCredentials.minAge,
        groupCredentials.maxAge,
        groupCredentials.skillLevel,
        groupCredentials.allowedGender
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


