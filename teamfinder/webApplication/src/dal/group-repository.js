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

    db.query(query, values, function(error, result){
        if(error){
            const databaseError = ["Something went wrong inserting data. Contact admin."]
            callback(databaseError, null)
        }
        else{
            callback(null, result.insertId)
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

exports.getActiveGroups = function(accountId, callback){
    const query = "SELECT GroupId FROM GroupMembers WHERE AccountId = ?"
    const values = [accountId]

    db.query(query, values, function(error, result){
        if(error){
            const databaseError = ["Something went wrong fetching active groups."]
            callback(databaseError, null)
        }
        else{
            callback(null, result)
        }
    })

}

exports.getAllGroupIds = function(callback){
    const query = "SELECT GroupId FROM Groups"
    db.query(query, function(error, result){
        if(error){
            const databaseError = ["Something went wrong fetching a group"]
        callback(databaseError, null)
        }
        else{
            callback(null, result)
        }
    })
}

exports.getGroupById = function(id, callback){

    const query = "SELECT * FROM Groups WHERE GroupId = ? LIMIT 1"
    const values = [id]
    db.query(query, values, function(error, result){
        if(error){
            const databaseError = ["Something went wrong fetching the group."]
            callback(databaseError, null)
        }
        else{            
            callback(null, result[0])
        }
    })    

}

exports.deleteGroupById = function(groupId, callback){

    const query = "DELETE FROM Groups WHERE GroupId = ?"
    const values = [
        groupId
    ]

    db.query(query, values, function(error){

        if(error){
            databaseError = "db error when deleting group"
            callback(databaseError)
        }
        else{
            callback(null)
        }
    })
}

exports.updateGroup = function(group, callback){

    const query = "UPDATE Groups SET Image = ?, Sport = ?, MemberSlots = ?, City = ?, MinAge = ?, MaxAge = ?, SkillLevel = ?, AllowedGender = ?"
    const values = [
        group.image,
        group.sport,
        group.memberSlots,
        group.city,
        group.minAge,
        group.maxAge,
        group.skillLevel,
        group.gender
    ]

    db.query(query, values, function(error, result){
        if(error){
            console.log(error)
            const databaseError = "Something went wrong when updating the group information"
            callback(databaseError)
        }
        else{
            callback(null)
        }
    })

}