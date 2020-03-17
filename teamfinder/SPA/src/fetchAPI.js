async function fetchAllGroups() {

    try {
        const response = await fetch(
            //"http://localhost:8080/pl-api/groups/"
            "http://192.168.99.100:8080/pl-api/groups/" // fors: ?accountId=" + accountId
        )

        switch (response.status) {

            case 200:
            case 204:

                const groups = await response.json()

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

    } catch (error) {
        console.log(error)
    }

}

async function fetchGroup(id) {

    try {

        const response = await fetch(
            //"http://localhost:8080/pl-api/groups/" + id
            "http://192.168.99.100:8080/pl-api/groups/" + id
        )

        switch (response.status) {

            case 201:

                const response = await response.json()

                const group = response.group
                const isAuthor = response.isAuthor

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

                //if(isAuthor)

                const deleteButton = document.querySelector("#group-page .delete-button")
                const updateButton = document.querySelector("#group-page .update-button")

                updateButton.setAttribute("href", "/group/" + group.groupId + "/update")

                //const updateButton = document.getElementById("update-button")
                // console.log("action before: ", updateButton.action)
                //updateButton.action = "/group/" + group.groupId + "/update"

                //console.log("action after: ", updateButton.action)
                deleteButton.classList.remove("showIfAuthor")
                deleteButton.classList.add("isAuthor")
                updateButton.classList.remove("showIfAuthor")
                updateButton.classList.add("isAuthor")
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


    } catch (error) {
        console.log(error)
    }
}

async function getGroupForUpdate(id) {

    try {

        const response = await fetch(
            //"http://localhost:8080/pl-api/groups/" + id
            "http://192.168.99.100:8080/pl-api/groups/" + id
        )
        switch (response.status) {

            case 201:
                const group = response.group
                const isAuthor = response.isAuthor

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
                errors = await response.json()
                console.log(errors)

                showErrors(errors)
        }

    } catch (error) {
        console.log(error)
    }
}

async function createGroup(group) {

    try {
        const response = await fetch(
            //"http://localhost:8080/pl-api/groups", {
            "http://192.168.99.100:8080/pl-api/groups/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                //"Authorization": "Bearer "+ localStorage.accessToken
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
    } catch (error) {
        console.log(error)
        goToPage("/error-connection")
    }

}

//wait with this one
async function deleteGroup(id) {
    try {

        const response = await fetch(
            //"http://localhost:8080/pl-api/groups/" + id, {
            "http://192.168.99.100:8080/pl-api/groups/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                //"Authorization": "Bearer "+ localStorage.accessToken
            }
        })
        switch (response.status) {

            case 201:
                goToPage(response.headers.get("Location"))//where should we go?
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

    } catch (error) {
        // TODO: Update the view and display error.
        console.log(error)
    }
}

async function authenticateUser(email, password) {

    try {

        const response = await fetch(
            //"http://localhost:8080/pl-api/accounts/tokens", {
            "http://192.168.99.100:8080/pl-api/accounts/tokens", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }, // TODO: Escape username and password in case they contained reserved characters in the x-www-form-urlencoded format.
            body: "grant_type=password&email=" + email + "&password=" + password
        })
        switch (response.status) {
            case 200:
                const body = await response.json()
                login(body.access_token)
                console.log(body.access_token)
                changeToPage("/")
                break
            case 400://bad validation(email, felmeddelande)
                break
            case 500:
                goToPage("/error")

        }

    } catch (error) {

        console.log(error)
        goToPage("/error")

    }
}

async function signUp(account) {


    try {
        const response = await fetch(
            //"http://localhost:8080/pl-api/accounts/sign-up, {
            "http://192.168.99.100:8080/pl-api/accounts/sign-up", {
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

    } catch (error) {
        console.log(error)
        goToPage("/error")
    }


}

async function updateGroup(group) {

    try {

        const response = await fetch(
            //"http://localhost:8080/pl-api/groups/" + groupId, {
            "http://192.168.99.100:8080/pl-api/groups/" + group.groupId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                //"Authorization": "Bearer "+ localStorage.accessToken
            },
            body: JSON.stringify(group)
        })
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

    } catch (error) {
        // TODO: Update the view and display error.
        console.log(error)
    }
}