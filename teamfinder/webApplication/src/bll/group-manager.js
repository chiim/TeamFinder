const groupRepository = require('../dal/group-repository')

function validation(groupCredentials) {

    const validationErrors = []

    const lettersOnly = '^[a-zA-Z]*$'
    const numbersOnly = '[0-9]$'
    const maxGroupNameLength = 30
    const minGroupNameLength = 2
    const maxNumberOfMembers = 20
    const minNumbeOfMembers = 2
    const maxCityLength = 30
    const minAllowedAge = 1
    const maxAllowedAge = 150
    const empty = 0

    if (groupCredentials.groupName.length < minGroupNameLength) {
        validationErrors.push("Group name is too short")
    }
    if (groupCredentials.groupName.length > maxGroupNameLength) {
        validationErrors.push("Group name is too long.")
    }
    if (!groupCredentials.groupName.match(lettersOnly)) {
        validationErrors.push("Only characters a-z allowed.")
    }

    if (groupCredentials.sport == "Select a sport") {
        validationErrors.push("Need to choose a sport.")
    }

    if (!groupCredentials.memberSlots.match(numbersOnly)) {
        validationErrors.push("Only numbes allowed.")
    }
    else if (parseInt(groupCredentials.memberSlots) < minNumbeOfMembers) {
        validationErrors.push("There need to be at least 2 member slots in the group.")
    }
    else if (parseInt(groupCredentials.memberSlots) > maxNumberOfMembers) {
        validationErrors.push("Can't be more than 20 members per group.")
    }

    if (!groupCredentials.city.match(lettersOnly)) {
        validationErrors.push("That's not a city.")
    }
    if (groupCredentials.city.length == empty) {
        validationErrors.push("Must enter a city.")
    }
    if (groupCredentials.city.length > maxCityLength) {
        validationErrors.push("This city contains too many signs. Try again.")
    }

    if (groupCredentials.minAge.length > empty || groupCredentials.maxAge.length > empty) {
        if (!groupCredentials.minAge.match(numbersOnly) || !groupCredentials.maxAge.match(numbersOnly)) {
            validationErrors.push("Age restriction: Only letters allowed.")
        }
        if (parseInt(groupCredentials.minAge) > maxAllowedAge || parseInt(groupCredentials.minAge) > maxAllowedAge) {
            validationErrors.push("Age restriction: You can't be this old. Try again.")
        }
        if (parseInt(groupCredentials.minAge < minAllowedAge) || parseInt(groupCredentials.maxAge) < minAllowedAge) {
            validationErrors.push("Age restriction: This person is too young to play. Should be at least 6 years old.")
        }

    }
    else{
        groupCredentials.minAge = null
        groupCredentials.maxAge = null
    }

    if(groupCredentials.skillLevel == "Select a skill level"){
        validationErrors.push("Choose what skill level you're at!")
    }

    return validationErrors
}

exports.createGroup = function (groupCredentials, callback) {

    const validationErrors = validation(groupCredentials)

    if (validationErrors.length > 0) {
        callback(validationErrors, null)
    }

    else {
        groupRepository.createGroup(groupCredentials, callback)
    }

}
