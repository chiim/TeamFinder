const parseJwt = function (token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}


async function fetchAllGroups() {

    const payload = parseJwt(localStorage.idToken)
    const accountId = payload.sub

    try {
        const response = await fetch(
            "http://localhost:8080/pl-api/groups/?accountId=" + accountId
            //"http://192.168.99.100:8080/pl-api/groups/?accountId=" + accountId
        )
        switch (response.status) {

            case 200:


                const groups = await response.json()

                console.log(groups)
                const ul = document.querySelector("#groups-page ul")
                ul.innerText = ""

                const pStatus = document.querySelector("#groups-page p")
                pStatus.innerText = ""

                if (groups == 0) {
                    pStatus.innerText = "you are not part of any group."
                }
                for (const group of groups) {
                    const li = document.createElement("li")
                    const anchor = document.createElement("a")
                    const pSport = document.createElement("p")
                    const pCity = document.createElement("p")
                    pSport.innerText = group.sport
                    pCity.innerText = group.city
                    anchor.innerText = group.name
                    anchor.setAttribute("href", '/group/' + group.groupId)
                    li.appendChild(anchor)
                    li.append(pSport)
                    li.append(pCity)
                    ul.append(li)

                }
                break

            case 400:
                errors = await response.json()
                console.log(errors)
                showErrors(errors)
                break
            case 500:
                goToPage("/error")
        }
        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")

    } catch (error) {
        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")
        console.log(error)
        goToPage("/error")
    }
}

async function fetchGroup(id) {

    try {

        const response = await fetch(
            "http://localhost:8080/pl-api/groups/" + id, {
            //"http://192.168.99.100:8080/pl-api/groups/" + id, {

            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.accessToken
            },
        }
        )

        switch (response.status) {

            case 200:

                const body = await response.json()

                const group = body.group
                const isAuthor = body.isAuthor

                const deleteButton = document.querySelector("#group-page .delete-button")
                const updateButton = document.querySelector("#group-page .update-button")

                deleteButton.classList.remove("showIfAuthor")
                updateButton.classList.remove("showIfAuthor")

                const nameSpan = document.querySelector("#group-page .name")
                const sportSpan = document.querySelector("#group-page .sport")
                const nrOfMembersSpan = document.querySelector("#group-page .nrOfMembers")
                const memberSlotsSpan = document.querySelector("#group-page .memberSlots")
                const citySpan = document.querySelector("#group-page .city")
                const maxAgeSpan = document.querySelector("#group-page .maxAge")
                const minAgeSpan = document.querySelector("#group-page .minAge")
                const skillLevelSpan = document.querySelector("#group-page .skillLevel")
                const allowedGenderSpan = document.querySelector("#group-page .allowedGender")
                const deleteIdField = document.querySelector("#group-page .delete-id-field")
                //updateIdField = document.querySelector("#group-page .update-id-field") Den skickar med grupp id som query. Behöver vi det?


                nameSpan.innerText = group.name
                sportSpan.innerText = group.sport
                nrOfMembersSpan.innerText = group.nrOfMembers
                memberSlotsSpan.innerText = group.memberSlots
                citySpan.innerText = group.city
                maxAgeSpan.innerText = group.maxAge
                minAgeSpan.innerText = group.minAge
                skillLevelSpan.innerText = group.skillLevel
                allowedGenderSpan.innerText = group.allowedGender

                deleteIdField.value = group.groupId
                //updateIdField.value = group.groupId

                if (isAuthor == true) {

                    updateButton.setAttribute("href", "/group/" + group.groupId + "/update")

                    //const updateButton = document.getElementById("update-button")
                    // console.log("action before: ", updateButton.action)
                    //updateButton.action = "/group/" + group.groupId + "/update"

                    //console.log("action after: ", updateButton.action)
                    deleteButton.classList.add("showIfAuthor")
                    updateButton.classList.add("showIfAuthor")
                }
                //goToPage(response.headers.get("Location"))
                break
            case 401:
                goToPage("/unauthorized")
                break
            case 500:
                goToPage("/error")
        }
        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")


    } catch (error) {
        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")
        console.log(error)
        goToPage("/error")
    }
}

async function getGroupForUpdate(id) {

    try {

        const response = await fetch(
            "http://localhost:8080/pl-api/groups/" + id, {
            //"http://192.168.99.100:8080/pl-api/groups/" + id, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.accessToken
            },
        }
        )
        switch (response.status) {

            case 200:

                const body = await response.json()

                const group = body.group
                const isAuthor = body.isAuthor

                const nameSpan = document.querySelector("#update-group-page .name")
                const sportSpan = document.querySelector("#update-group-page .sport")
                const memberSlotsSpan = document.querySelector("#update-group-page .memberSlots")
                const citySpan = document.querySelector("#update-group-page .city")
                const maxAgeSpan = document.querySelector("#update-group-page .maxAge")
                const minAgeSpan = document.querySelector("#update-group-page .minAge")
                const skillLevelSpan = document.querySelector("#update-group-page .skillLevel")
                const allowedGenderSpan = document.querySelector("#update-group-page .allowedGender")
                const updateIdField = document.querySelector("#update-group-page .update-id-field")


                nameSpan.value = group.name
                sportSpan.value = group.sport
                memberSlotsSpan.value = group.memberSlots
                citySpan.value = group.city
                maxAgeSpan.value = group.maxAge
                minAgeSpan.value = group.minAge
                skillLevelSpan.value = group.skillLevel
                allowedGenderSpan.value = group.allowedGender

                updateIdField.value = group.groupId

                break

            case 400:
                errors = await response.json()
                console.log(errors)
                showErrors(errors)
                break
            case 500:
                goToPage("/error")
        }

        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")

    } catch (error) {
        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")
        console.log(error)
        goToPage("/error")
    }
}

async function createGroup(group) {

    try {
        const response = await fetch(
            "http://localhost:8080/pl-api/groups", {
            //"http://192.168.99.100:8080/pl-api/groups/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.accessToken
            },
            body: JSON.stringify(group)
        })
        console.log("after fetch create group")
        switch (response.status) {

            case 201:
                goToPage(response.headers.get("Location"))
                break
            case 400:
                errors = await response.json()
                console.log(errors)
                showErrors(errors)
                break
            case 500:
                goToPage("/error")
        }
        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")

    } catch (error) {
        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")
        console.log(error)
        goToPage("/error")
    }

}

//wait with this one
async function deleteGroup(id) {
    try {

        const response = await fetch(
            "http://localhost:8080/pl-api/groups/" + id, {
            //"http://192.168.99.100:8080/pl-api/groups/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.accessToken
            }
        })
        switch (response.status) {

            case 204:
                console.log(204)
                goToPage("/groups")
                break
            case 401:
                goToPage("/unauthorized")
                break
            case 500:
                goToPage("/error")
        }

        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")


    } catch (error) {
        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")
        console.log(error)
        goToPage("/error")
    }
}

async function authenticateUser(email, password) {
    try {

        const response = await fetch(
            "http://localhost:8080/pl-api/accounts/tokens", {
            //"http://192.168.99.100:8080/pl-api/accounts/tokens", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }, // TODO: Escape username and password in case they contained reserved characters in the x-www-form-urlencoded format.
            body: "grant_type=password&email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password)
        })
        switch (response.status) {
            case 200:
                const body = await response.json()
                login(body.access_token, body.id_token)
                console.log(body.access_token, body.id_token)
                changeToPage("/")
                break
            case 400://bad validation(email, felmeddelande)
                const errors = await response.json()
                showErrors(errors)
                break
            case 500:
                goToPage("/error")

        }
        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")

    } catch (error) {
        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")
        console.log(error)
        goToPage("/error")
    }
}


//TODO: Antar att denna ska va async?
async function googleSignIn(authResult) {
    if (authResult['code']) {
        console.log("auth result: ", authResult)
        console.log("Authorization code: ", authResult['code'])
        try {
            const response = await fetch(
                "https://oauth2.googleapis.com/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json"
                },
                body: "code=" + encodeURIComponent(authResult['code']) + "&client_id=978799927734-pjt940r3kndgp0ad8m1rvbn2vjvb19tk.apps.googleusercontent.com&client_secret=WO5YL8x_DRKWhmH440__jD3Y&redirect_uri=http://localhost:3000&grant_type=authorization_code"
            })

            switch (response.status) {
                case 200:
                    const googleBody = await response.json()
                    const accessToken = googleBody.access_token
                    const idToken = parseJwt(googleBody.id_token)
                    getGoogleAccount(accessToken, idToken)
                    break
                default:
                    goToPage('/error')
                    break
            }
            document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")
        }
        catch (error) {
            document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")
            console.log(error)
            goToPage("/error")
        }

    } 
    else {
        console.log("Google auth went wrong. See fetchAPI signInCallback function")
    }
}

async function getGoogleAccount(accessToken, idToken) {
    try {
        const response = await fetch(
            "http://localhost:8080/pl-api/accounts/" + idToken.sub
        )
        switch (response.status) {
            case 204:
                localStorage.ongoingSignup = true
                login(accessToken, idToken)
                goToPage('/google-sign-up')
                break
            case 200:
                const googleId = await response.json()
                console.log("googleId when logging in: ", googleId)
                    login(accessToken, idToken)
                break
        }
        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")
    }
    catch (error) {
        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")
        console.log(error)
        goToPage("/error")
    }
}

async function signUp(account) {


    try {
        const response = await fetch(
            "http://localhost:8080/pl-api/accounts/sign-up", {
            //"http://192.168.99.100:8080/pl-api/accounts/sign-up", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                //"Authorization": "Bearer "+ localStorage.accessToken
            },
            body: JSON.stringify(account)
        })

        // TODO: Check status code to see if it succeeded. Display errors if it failed.
        console.log("returned from sign up fetch")
        switch (response.status) {

            case 201:
                goToPage("/login")
                break
            case 400:
                errors = await response.json()
                showErrors(errors)
                break
            case 500:
                goToPage("/error")
        }
        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")

    } catch (error) {
        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")
        console.log(error)
        goToPage("/error")
    }


}

async function updateGroup(group) {

    console.log("REEEEEEEEEEEEEEEEEEEEEEEEE")
    try {

        const response = await fetch(
            "http://localhost:8080/pl-api/groups/" + group.groupId, {
            //"http://192.168.99.100:8080/pl-api/groups/" + group.groupId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.accessToken
            },
            body: JSON.stringify(group)
        })
        switch (response.status) {

            case 204://??
                goToPage(response.headers.get("Location"))
                break
            case 404:
                errors = await response.json()
                console.log(errors)
                showErrors(errors)
                break
            case 401:
                goToPage("/unauthorized")
                break
            case 500:
                goToPage("/error")
        }
        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")


    } catch (error) {
        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")
        console.log(error)
        goToPage("/error")
    }
}