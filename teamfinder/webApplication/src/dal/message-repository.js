
module.exports = function ({ db }) {
    return {

        createMessage: function (message, callback) {

            const query = "INSERT INTO Messages (GroupId, AccountId, Text, AuthorName) VALUES (?, ?, ?, ?)"

            const values = [
                message.groupId,
                message.accountId,
                message.text,
                message.authorName
            ]
            db.query(query, values, function (error, result) {

                if (error) {
                    callback(error)
                }
                else {
                    callback(null)

                }
            })
        },

        getMessagesByGroupId: function (groupId, callback) {

            const query = "SELECT * FROM Messages WHERE GroupId = ? ORDER BY MessageId DESC"
            const values = [groupId]

            db.query(query, values, function (error, messages) {

                if (error) {
                    const databaseError = ["something went wrong getting messages from database"]
                    callback(databaseError, null)
                }
                else {
                    callback(null, messages)
                }

<<<<<<< HEAD
            })

        },

        deleteMessageById: function(messageId, callback) {

            const query = "DELETE FROM Messages WHERE MessageId = ?"
            const values = [
                messageId
            ]
            db.query(query, values, function (error) {

                if (error) {
                    const databaseError = "db error when deleting message"
                    callback(databaseError)
                }
                else {
                    callback(null)
                }

            })
        }
    }
=======
    })
}

exports.updateMessageById = function(message, callback) {

    const query = "UPDATE Messages SET Text = ? WHERE MessageId = ?"
    const values = [
        message.messageText,
        message.messageId
    ]

    db.query(query, values, function(error){

        if(error){
            const databaseError = "error when updating message"
            callback(databaseError)
        }
        else{
            callback(null)
        }
    })
>>>>>>> 523913bb1befbfae22a50d115a1dae171842ed5f
}