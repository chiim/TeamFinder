
module.exports = function () {
    return {

        validateGroup: function (groupCredentials) {

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
                validationErrors.push("GroupName: Only characters a-z allowed.")
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
            else {
                groupCredentials.minAge = null
                groupCredentials.maxAge = null
            }

            if (groupCredentials.skillLevel == "Select a skill level") {
                validationErrors.push("Choose what skill level you're at!")
            }

            return validationErrors
        },

        validateRequirements: function (account, group) {
            const validationErrors = []
            if (group.nrOfMembers >= group.memberSlots) {
                validationErrors.push("This group is full.")
            }

            if (group.minAge) {
                if (parseInt(account.age) < parseInt(group.minAge)) {
                    validationErrors.push("You're too young to join this group.")
                }
            }
            if (group.maxAge) {
                if (parseInt(account.age) > parseInt(group.maxAge)) {
                    validationErrors.push("You're too old to join this group.")
                }
            }

            if(group.minAge && group.maxAge){
                if(parseInt(group.minAge) > parseInt(group.maxAge)){
                    validationErrors.push("minAge cant be lower than maxAge")
                }
            }
            if (group.allowedGender != 'Any') {
                if (account.gender != group.allowedGender) {
                    validationErrors.push("You're not allowed to join this group. It's restricted to " + group.allowedGender)
                }
            }
            return validationErrors

        },

        validateAccount: function (account) {

            const errors = []

            MAX_PASSWORD_LENGTH = 10
            MIN_PASSWORD_LENGTH = 2

            // Validate username.
            if (!account.hasOwnProperty("firstName")) {
                errors.push("firstNameMissing")
            } else if (!account.hasOwnProperty("lastName")) {
                errors.push("lastNameMissing")
            } else if (!account.hasOwnProperty("email")) {
                errors.push("emailMissing")
            } else if (!account.hasOwnProperty("password")) {
                errors.push("passwordMissing")
            } else if (account.password.length < MIN_PASSWORD_LENGTH) {
                errors.push("passwordTooShort")
            } else if (MAX_PASSWORD_LENGTH < account.password.length) {
                errors.push("passwordTooLong")
            } else if (!account.hasOwnProperty("age")) {
                errors.push("ageMissing")
            } else if (!account.hasOwnProperty("city")) {
                errors.push("cityMissing")
            } else if (!account.hasOwnProperty("gender")) {
                errors.push("genderMissing")
            }

            return errors

        },

        updateAccount: function (account) {

            const errors = []

            MAX_PASSWORD_LENGTH = 10
            MIN_PASSWORD_LENGTH = 2

            // Validate username.
            if (!account.hasOwnProperty("firstName")) {
                errors.push("firstNameMissing")
            } else if (!account.hasOwnProperty("lastName")) {
                errors.push("lastNameMissing")
            } else if (!account.hasOwnProperty("email")) {
                errors.push("emailMissing")
            } else if (!account.hasOwnProperty("age")) {
                errors.push("ageMissing")
            } else if (!account.hasOwnProperty("city")) {
                errors.push("cityMissing")
            } else if (!account.hasOwnProperty("gender")) {
                errors.push("genderMissing")
            }

            return errors

        }
    }
}