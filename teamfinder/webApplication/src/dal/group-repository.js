const mySql = require('mysql')
const db = require('./dbConnection')

exports.createGroup = function(groupCredentials, callback){
    //const today = new Date()
    //date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()

    const authorId = '1' //här ska ett dynamiskt id hämtas med rätt skapare id

    const query = "INSERT INTO Groups (`Name`, Image, Sport, NrOfMembers, MemberSlots, City, MaxAge, MinAge, SkillLevel, AllowedGender, AuthorId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"

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
        authorId
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
            callback(databaseError, null)
        }
        else{
            callback(null, result)
        }
    })
}

exports.getActiveGroups = function(id, callback){
    

}

exports.getGroupById = function(id, callback){

    const query = "SELECT * FROM Groups WHERE GroupId = ? LIMIT 1"
    const values = [id]
    db.query(query, values, function(error, result){
        if(error){
            console.log("Error")
            const databaseError = ["Something went wrong fetching the group."]
            callback(databaseError, null)
        }
        else{
            console.log("gruppen som hämtats:" + result[0])
            
            callback(null, result[0])
        }
    })    

}