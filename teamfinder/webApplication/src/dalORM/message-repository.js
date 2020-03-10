const dbPostgres = require('../dalORM/dbConnection')

module.exports = function () {

    return {

        createMessage: function (message, callback) {
            const dbMessage = dbPostgres.model("message")

            dbMessage.create({
                groupId: message.groupId,
                accountId: message.accountId,
                text: message.text,
                authorName: message.authorName
            }).then(function () {
                callback(null)
            }).catch(function (error) {
                console.log(error)
                const databaseError = "Could not create message."
                callback(databaseError)
            })
        },

        getMessagesByGroupId: function (groupId, callback) {
            const dbMessage = dbPostgres.model("message")

            dbMessage.findAll({
                where: {
                    groupId: groupId
                },
                raw: true,
                model: "message"
                //order: [messageId, 'DESC']
            }).then(function (messages) {
                callback(null, messages)
            }).catch(function (error) {
                console.log(error)
                const databaseError = "something went wrong getting messages from database"
                callback(databaseError, null)
            })
        },

        deleteMessageById: function (messageId, callback) {
            const dbMessage = dbPostgres.model('message')

            dbMessage.destroy({
                where: {
                    messageId: messageId
                }
            }).then(function(){
                callback(null)
            }).catch(function(error){
                console.log(error)
                const databaseError = "Something went wrong deleting your message from the database"
                callback(databaseError)
            })
        },

        updateMessageById: function(message, callback){
            const dbMessage = dbPostgres.model('message')

            dbMessage.update({
                text: message.text,
            },{
                where: {
                    messageId: message.messageId
                }
            }).then(function(){
                callback(null)
            }).catch(function(error){
                console.log(error)
                const databaseError = "Something went wrong updating your message in the database"
                callback(databaseError)
            })
        }
    }
}