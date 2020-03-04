
module.exports = function ({dbPostgres}) {

    return {

        createGroup: function (groupCredentials, callback) {

            const dbGroup = dbPostgres.model("group")

            dbGroup.create({
                name: groupCredentials.groupName,
                image: groupCredentials.image,
                sport: groupCredentials.sport,
                nrOfMembers: groupCredentials.nrOfMembers,
                memberSlots: groupCredentials.memberSlots,
                city: groupCredentials.city,
                maxAge: groupCredentials.minAge,
                minAge: groupCredentials.maxAge,
                skillLevel: groupCredentials.skillLevel,
                allowedGender: groupCredentials.allowedGender,
                authorId: groupCredentials.accountId
            },{
                model: "group",
                raw: true
            }).then(function (group) {
                
                callback(null, group.dataValues.groupId)
            }).catch(function (error) {
                console.log(error, null)
                const databaseError = "Something went wrong inserting data. Contact admin."
                callback(databaseError)
            })
        },

        getAllGroups: function (callback) {

            const dbGroup = dbPostgres.model("group")

            dbGroup.findAll( {raw: true} ).then(function (groups) {
                callback(null, groups)
            }).catch(function (error) {
                console.log(error)
                const databaseError = "Something went wrong retrieving groups"
                callback(databaseError, null)
            })
        },

        getActiveGroups: function (accountId, callback) {

            const dbGroupMembers = dbPostgres.model("groupMember")

            dbGroupMembers.findAll({
                attributes: ['groupId'],
                where: {
                    accountId: accountId
                },                
                raw: true
            }).then(function (groups) {
                callback(null, groups)
            }).catch(function (error) {
                console.log(error)
                const databaseError = "Something went wrong retrieving groups"
                callback(databaseError, null)
            })
        },

        getAllGroupIds: function (callback) {

            const dbGroup = dbPostgres.model("group")


            dbGroup.findAll({
                attributes: ['groupId'],
                raw: true
            }).then(function (groupIds) {
                callback(null, groupIds)
            }).catch(function (error) {
                console.log(error)
                const databaseError = "Something went wrong retrieving groupsIds"
                callback(databaseError, null)
            })


        },

        getGroupById: function (groupId, callback) {

            const dbGroup = dbPostgres.model("group")

            dbGroup.findByPk(groupId, {raw: true} ).then(function (group) {
                callback(null, group)
            }).catch(function (error) {
                console.log(error)
                const databaseError = "Something went wrong retrieving group"
                callback(databaseError, null)
            })

        },

        deleteGroupById: function (groupId, callback) {

            const dbGroup = dbPostgres.model("group")

            dbGroup.destroy({
                where: {
                    groupId: groupId
                }
            }).then(function () {
                callback(null)
            }).catch(function (error) {
                console.log(error)
                const databaseError = "Something went wrong retrieving group"
                callback(databaseError)
            })
        },


        updateGroup: function (group, callback) {

            const dbGroup = dbPostgres.model("group")          

            dbGroup.update({
                image: group.image,
                sport: group.sport,
                memberSlots: group.memberSlots,
                city: group.city,
                maxAge: group.minAge,
                minAge: group.maxAge,
                skillLevel: group.skillLevel,
                allowedGender: group.gender
            }, {
                where: {
                    groupId: group.id
                }
            }).then(function(){
                callback(null)
            }).catch(function(error){
                console.log(error)
                const databaseError = "Something went wrong updating group"
                callback(databaseError)
            })
        }

    }


}