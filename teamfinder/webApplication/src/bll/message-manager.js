
module.exports = function ({ messageRepository }) {
    return {

        createMessage: function (message, callback) {

            //validation

            errors = []

            if (!message.hasOwnProperty("groupId")) {
                errors.push("groupId missing")
            } else if (!message.hasOwnProperty("accountId")) {
                errors.push("accountId missing")
            } else if (!message.hasOwnProperty("text")) {
                errors.push("text missing")
            } else if (!message.hasOwnProperty("authorName")) {
                errors.push("authorName missing")
            }

            if (0 < errors.length) {
                callback(errors)
                return
            }

            messageRepository.createMessage(message, callback)
        },

        getMessagesByGroupId: function (groupId, callback) {
            messageRepository.getMessagesByGroupId(groupId, callback)
        },

        deleteMessageById: function (messageId, callback) {
            messageRepository.deleteMessageById(messageId, callback)

        },

        updateMessageById: function (message, callback) {
            messageRepository.updateMessageById(message, callback)
        }
    }
}