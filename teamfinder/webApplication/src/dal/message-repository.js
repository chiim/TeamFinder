
module.exports = function ({ dbMySQL }) {
    return {

        createMessage: function (message, callback) {

            const query = "INSERT INTO Messages (groupId, accountId, text, authorName) VALUES (?, ?, ?, ?)"

            const values = [
                message.groupId,
                message.accountId,
                message.text,
                message.authorName
            ]
            dbMySQL.query(query, values, function (error, result) {

                if (error) {
                    console.log(error)
                    const databaseError = "Could not create message"
                    callback(databaseError)
                }
                else {
                    callback(null)

                }
            })
        },

        getMessagesByGroupId: function (groupId, callback) {

            const query = "SELECT * FROM Messages WHERE groupId = ? ORDER BY messageId DESC"
            const values = [groupId]

            dbMySQL.query(query, values, function (error, messages) {

                if (error) {
                    const databaseError = ["something went wrong getting messages from database"]
                    callback(databaseError, null)
                }
                else {
                    callback(null, messages)
                }

            })

        },

        deleteMessageById: function (messageId, callback) {

            const query = "DELETE FROM Messages WHERE messageId = ?"
            const values = [
                messageId
            ]
            dbMySQL.query(query, values, function (error) {

                if (error) {
                    const databaseError = "dbMySQL error when deleting message"
                    callback(databaseError)
                }
                else {
                    callback(null)
                }

            })
        },




        updateMessageById: function (message, callback) {

            const query = "UPDATE Messages SET text = ? WHERE messageId = ?"
            const values = [
                message.messageText,
                message.messageId
            ]

            dbMySQL.query(query, values, function (error) {

                if (error) {
                    const databaseError = "error when updating message"
                    callback(databaseError)
                }
                else {
                    callback(null)
                }
            })
        }
    }
}