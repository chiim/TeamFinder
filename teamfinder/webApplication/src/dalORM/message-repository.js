
module.exports = function ({ dbPostgres }) {

    const Message = dbPostgres.Message
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