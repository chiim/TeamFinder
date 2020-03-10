// TODO: Don't write all JS code in the same file.


document.addEventListener("DOMContentLoaded", function () {

    console.log(location.pathname)

    hideErrors()//is it okey to hide errors here????
    changeToPage(location.pathname)

    if (localStorage.accessToken) {
        login(localStorage.accessToken)
    } else {
        logout()
    }

    document.body.addEventListener("click", function (event) {
        if (event.target.tagName == "A") {
            event.preventDefault()
            const url = event.target.getAttribute("href")
            goToPage(url)
        }
    })

    // TODO: Avoid using this long lines of code.
    document.querySelector("#create-group-page form").addEventListener("submit", function (event) {
        event.preventDefault()

        const group = createdGroupInput()
        console.log(group)
        createGroup(group)
    })

    document.querySelector("#update-group-page form").addEventListener("submit", function (event) {
        event.preventDefault()

        const group = updatedGroupInput()
        console.log(group)
        updateGroup(group)
    })

    document.querySelector("#group-page .delete-button").addEventListener("submit", function (event) {
        event.preventDefault()

        const id = document.querySelector("#group-page .delete-id-field").value

        deleteGroup(id)
    })

    document.querySelector("#login-page form").addEventListener("submit", function (event) {
        event.preventDefault()

        const email = document.querySelector("#login-page .email").value
        const password = document.querySelector("#login-page .password").value

        authenticateUser(email, password)
    })

    document.querySelector("#sign-up-page form").addEventListener("submit", function (event) {
        event.preventDefault()

        const account = signupInput()

        signUp(account)
    })
})

window.addEventListener("popstate", function (event) {
    const url = location.pathname
    changeToPage(url)
})

function goToPage(url) {

    changeToPage(url)
    history.pushState({}, "", url)

}

function changeToPage(url) {

    hideErrors()

    const currentPageDiv = document.getElementsByClassName("current-page")[0]
    if (currentPageDiv) {
        currentPageDiv.classList.remove("current-page")
    }

    // TODO: Optimally this information can be put in an array instead of having a long list of if-else if statements.
    // TODO: Factor out common code in all branches.
    if (url == "/") {
        console.log("Hallåå??")
        document.getElementById("home-page").classList.add("current-page")
    } else if (url == "/groups") {
        console.log("inside fetchallgroupsssssssssssssssss")
        document.getElementById("groups-page").classList.add("current-page")
        fetchAllGroups()
    } else if (url == "/sign-up") {
        document.getElementById("sign-up-page").classList.add("current-page")
    } else if (url == "/login") {
        document.getElementById("login-page").classList.add("current-page")
    } else if (new RegExp("^/group/[0-9]+/update$").test(url)) {
        console.log("Do I get here? :)")
        document.getElementById("update-group-page").classList.add("current-page")
        const id = url.split("/")[2]
        getGroupForUpdate(id)
    }
    else if (new RegExp("^/group/[0-9]+$").test(url)) {
        document.getElementById("group-page").classList.add("current-page")
        const id = url.split("/")[2]
        fetchGroup(id)
    } else if (url == "/create-group") {
        document.getElementById("create-group-page").classList.add("current-page")
    } else if (url == "/logout") {
        logout()
        document.getElementById("home-page").classList.add("current-page")
    } else if (url == "/error-database") {
        document.getElementById("error-page-database").classList.add("current-page")
    } else if (url == "/error-server") {
        document.getElementById("error-page-server").classList.add("current-page")
    } else {
        document.getElementById("error-page").classList.add("current-page")
    }
}

function login(accessToken) {
    localStorage.accessToken = accessToken
    document.body.classList.remove("isLoggedOut")
    document.body.classList.add("isLoggedIn")
}

function logout() {
    localStorage.accessToken = ""
    document.body.classList.remove("isLoggedIn")
    document.body.classList.add("isLoggedOut")
}

function createdGroupInput() {
    const groupName = document.querySelector("#create-group-page .name").value
    const sport = document.querySelector("#create-group-page .sport").value
    const memberSlots = document.querySelector("#create-group-page .memberSlots").value
    const city = document.querySelector("#create-group-page .city").value
    const maxAge = document.querySelector("#create-group-page .maxAge").value
    const minAge = document.querySelector("#create-group-page .minAge").value
    const skillLevel = document.querySelector("#create-group-page .skillLevel").value
    const allowedGender = document.querySelector("#create-group-page .allowedGender").value

    console.log(groupName)

    const group = {
        groupName,
        sport,
        memberSlots,
        city,
        maxAge,
        minAge,
        skillLevel,
        allowedGender
    }

    return group
}

function updatedGroupInput() {
    const groupName = document.querySelector("#update-group-page .name").value
    const sport = document.querySelector("#update-group-page .sport").value
    const memberSlots = document.querySelector("#update-group-page .memberSlots").value
    const city = document.querySelector("#update-group-page .city").value
    const maxAge = document.querySelector("#update-group-page .maxAge").value
    const minAge = document.querySelector("#update-group-page .minAge").value
    const skillLevel = document.querySelector("#update-group-page .skillLevel").value
    const allowedGender = document.querySelector("#update-group-page .allowedGender").value
    const groupId = document.querySelector("#update-group-page .update-id-field").value

    const group = {
        groupName,
        sport,
        memberSlots,
        city,
        maxAge,
        minAge,
        skillLevel,
        allowedGender,
        groupId
    }
    return group
}

function signupInput() {
    const firstName = document.querySelector("#sign-up-page .firstName").value
    const lastName = document.querySelector("#sign-up-page .lastName").value
    const email = document.querySelector("#sign-up-page .email").value
    const password = document.querySelector("#sign-up-page .password").value
    const age = document.querySelector("#sign-up-page .age").value
    const city = document.querySelector("#sign-up-page .city").value
    const gender = document.querySelector("#sign-up-page .gender").value

    const account = {
        firstName,
        lastName,
        email,
        password,
        city,
        gender,
        age
    }

    return account
}

function showErrors(errors){

    const ulWithErrors = document.getElementById("ulWithErrors")
    ulWithErrors.innerHTML = "";

    for(i = 0; i < errors.length; i++ ){

        const liError = document.createElement("li")
        ulWithErrors.appendChild(liError)
        liError.innerText = errors[0]
    }

    document.getElementById("error-div").classList.add("current-page")
}

function hideErrors(){
    document.getElementById("error-div").classList.remove("current-page")
}