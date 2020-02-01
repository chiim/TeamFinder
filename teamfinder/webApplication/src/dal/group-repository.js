const mySql = require('mysql')
const db = require('./dbConnection')

exports.createGroup = function(groupCredentials, callback){
    const today = new Date()
    date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    console.log(date)
    const query = "INSERT INTO Groups (`Name`, Image, Sport, NrOfMembers, MemberSlots, City, MaxAge, MinAge, SkillLevel, AllowedGender, PublishingDate, AuthorId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"

    const values = [
        groupCredentials.groupName,
        groupCredentials.image,
        groupCredentials.sport,
        groupCredentials.nrOfMembers,
        groupCredentials.memberSlots,
        groupCredentials.city,
        groupCredentials.minAge,
        groupCredentials.maxAge,
        groupCredentials.skillLevel,
        groupCredentials.allowedGender,
        date,
        '1'
    ]

    console.log(values)

    db.query(query, values, function(error, result){
        if(error){
            const databaseError = ["Something went wrong inserting data. Contact admin."]
            console.log(error)
            callback(databaseError, null)
        }
        else{
            callback(null, result)
        }
    })

}

exports.getAllGroups = function(callback){
    const query = "SELECT * FROM Groups"
    db.query(query, function(error, result){
        if(error){
            const databaseError = ["Something went wrong fetching groups. Contact admin."]
            callback(error, null)
        }
        else{
            callback(null, result)
        }
    })
}

exports.findGroupById = function(id, callback){

    const query = "SELECT * FROM Groups WHERE GroupId = ? LIMIT 1"
    const values = [id]
    db.query(query, values, function(error, result){
        if(error){
            console.log("Error")
            const databaseError = ["Something went wrong fetching the group."]
            callback(databaseError, null)
        }
        else{
            console.log(result[0])
            callback(null, result[0])
        }
    })    

}