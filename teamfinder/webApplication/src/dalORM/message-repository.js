
module.exports = function ({ dbPostgres }) {

    const Message = dbPostgres.Message
    return {

        createMessage: function (message, callback) {
            Message.create({
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

            Message.findAll({
                where: {
                    groupId: groupId
                },
                order: [messageId, 'DESC']
            }).then(function (messages) {
                callback(null, messages)
            }).catch(function (error) {
                console.log(error)
                const databaseError = "something went wrong getting messages from database"
                callback(databaseError, null)
            })
        }
    }
}