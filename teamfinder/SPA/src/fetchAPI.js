const parseJwt = function (token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

function fetchAllGroups() {
    const payload = parseJwt(localStorage.idToken)
    if (payload) {
        console.log("google payload: ", payload)
        // Logged in with google account
        var fetchLink = ""
        if (payload.email) {
            fetchLink = "http://localhost:8080/pl-api/groups"
        }
        else {
            const accountId = payload.sub
            fetchLink = "http://localhost:8080/pl-api/groups?accountId=" + accountId
        }
        fetch(
            fetchLink
            //"http://192.168.99.100:8080/pl-api/groups/?accountId=" + accountId
        ).then(function (response) {
            console.log("inside fetchallgroupsssssssssssssssss")
            console.log("response: ", response)
            // TODO: Check status code to see if it succeeded. Display errors if it failed.
            return response.json()
        }).then(function (groups) {
            const ul = document.querySelector("#groups-page ul")
            ul.innerText = ""
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
            document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")
        }).catch(function (error) {
            console.log(error)
            document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")
        })
    }
    else {
        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")
        const error = ["You need to sign in to view your groups"]
        showErrors(error)
    }
}

function fetchGroup(id) {

    console.log("id: ", id)

    fetch(
        "http://localhost:8080/pl-api/groups/" + id, {
        //"http://192.168.99.100:8080/pl-api/groups/" + id, {

        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.accessToken
        },
    }
    ).then(function (response) {
        // TODO: Check status code to see if it succeeded. Display errors if it failed.
        return response.json()
    }).then(function (response) {


        const group = response.group
        const isAuthor = response.isAuthor

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
        console.log("isAuthor: ", isAuthor)
        if (isAuthor) {


            updateButton.setAttribute("href", "/group/" + group.groupId + "/update")

            //const updateButton = document.getElementById("update-button")
            // console.log("action before: ", updateButton.action)
            //updateButton.action = "/group/" + group.groupId + "/update"

            //console.log("action after: ", updateButton.action)
            deleteButton.classList.add("showIfAuthor")
            updateButton.classList.add("showIfAuthor")
        }
        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")
    }).catch(function (error) {
        console.log(error)
        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")
    })
}

function getGroupForUpdate(id) {
    console.log("id: ", id)
    fetch(
        "http://localhost:8080/pl-api/groups/" + id, {
        //"http://192.168.99.100:8080/pl-api/groups/" + id, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.accessToken
        },
    }
    ).then(function (response) {
        // TODO: Check status code to see if it succeeded. Display errors if it failed.
        return response.json()
    }).then(function (response) {
        const group = response.group

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

        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")

    }).catch(function (error) {
        console.log(error)
        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")
    })
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
                errors = await response.json()
                console.log(errors)

                showErrors(errors)
        }
        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")
    } catch (error) {
        console.log(error)
        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")
        goToPage("/error-connection")
    }

}

//wait with this one
function deleteGroup(id) {
    fetch(
        "http://localhost:8080/pl-api/groups/" + id, {
        //"http://192.168.99.100:8080/pl-api/groups/" + id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.accessToken
        }
    }
    ).then(function (response) {
        // TODO: Check status code to see if it succeeded. Display errors if it failed.
        // TODO: Update the view somehow.
        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")
        goToPage(response.headers.get("Location"))

    }).catch(function (error) {
        // TODO: Update the view and display error.
        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")
        console.log(error)
    })
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
function googleSignIn(authResult) {
    if (authResult['code']) {
        console.log("auth result: ", authResult)
        console.log("Authorization code: ", authResult['code'])
        fetch(
            "https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json"
            },
            body: "code=" + encodeURIComponent(authResult['code']) + "&client_id=978799927734-pjt940r3kndgp0ad8m1rvbn2vjvb19tk.apps.googleusercontent.com&client_secret=WO5YL8x_DRKWhmH440__jD3Y&redirect_uri=http://localhost:3000&grant_type=authorization_code"
        }).then(function (response) {
            return response.json()
        }).then(function (googleBody) {
            const accessToken = googleBody.access_token
            console.log("Google tokens: ", googleBody)

            const idToken = parseJwt(googleBody.id_token)
            console.log("idToken id: ", idToken)
            
            // TODO: 
            // Try to fetch() a user with idToken.sub (google userId)
            // If user doesn't exist: Create an account for them
            // If they do exist, proceed to login.

            fetch(
                // Check if google account is registered
                "http://localhost:8080/pl-api/accounts/" + idToken.sub
                ).then(function(response){
                    if(response){
                        console.log("idToken sub: ", idToken.sub)
                        console.log("response when logging in: ", response)
                        if(response.status == 204){
                            // No account with the google ID.
                            return null 
                        }
                        else{
                            return response.json()
                        }
                    }
                }).then(function(googleId){
                    console.log("googleId when logging in: ", googleId)
                    if(googleId != null){
                        login(accessToken, idToken)
                    }
                    // First time logging in with google. Time to register account
                    else{
                        const firstName = idToken.given_name
                        const lastName = idToken.family_name
                        const email = idToken.email
            
                        // Leave empty and let login look for googleId instead?
                        const password = "fhhfjoewno" 
                        const city = idToken.locale // Det e landets initialer, dvs "sv"
                        const gender = "Any" // Lets call this a google feature.
                        const googleId = idToken.sub
                        console.log("GOOGLE ID: ", googleId)
                        const age = 25 // DENNA FÅR INTE VARA HÅRDKODAD
                        const account = {
                            googleId,
                            firstName,
                            lastName,
                            email,
                            password,
                            city,
                            gender,
                            age
                        }
                        console.log("creating google account: ", account)
                        signUp(account)
                        login(accessToken, idToken)
                    }
                })            
            //TODO: Gör så ett Google konto registreras i databasen. 
            //Får vi det o funka har vi 5 i projektet <3
            
            
            //signUpUsingGoogle(idToken.sub)
        })

        // Hide the sign-in button now that the user is authorized, for example:

        // Send the code to the server
        /*fetch(
            "http://localhost:8080/pl-api/accounts/tokens", {
            //"http://192.168.99.100:8080/pl-api/accounts/tokens", {
            method: 'POST',
            // Always include an `X-Requested-With` header in every AJAX request,
            // to protect against CSRF attacks.
            headers: {
                //'X-Requested-With': 'XMLHttpRequest',
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "grant_type=password&authCode=" + encodeURIComponent(authResult['code'])

        })*/
    }
    else {
        console.log("Google auth went wrong. See fetchAPI signInCallback function")
        // There was an error.
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
            case 500:
                goToPage("/error-database")
            case 400:
                errors = await response.json()
                showErrors(errors)
                break
            case 201:
                goToPage("/login")
                break
        }
        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")

    } catch (error) {
        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")
        console.log(error)
        goToPage("/error")
    }


}

function updateGroup(group) {
    fetch(
        "http://localhost:8080/pl-api/groups/" + group.groupId, {
        //"http://192.168.99.100:8080/pl-api/groups/" + group.groupId, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.accessToken
        },
        body: JSON.stringify(group)
    }
    ).then(function (response) {
        // TODO: Check status code to see if it succeeded. Display errors if it failed.
        // TODO: Update the view somehow.
        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")

        goToPage(response.headers.get("Location"))
    }).catch(function (error) {
        // TODO: Update the view and display error.
        document.getElementById("loadingIndicator").classList.add("loadingIndicatorHide")
        console.log(error)
    })
}