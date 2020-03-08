// TODO: Don't write all JS code in the same file.
document.addEventListener("DOMContentLoaded", function () {

    changeToPage(location.pathname)

    console.log(localStorage.accessToken)

    if (localStorage.accessToken) {
        console.log("finns accestoken? ")
        login(localStorage.accessToken)
    } else {
        console.log("else logout")
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
	document.querySelector("#create-group-page form").addEventListener("submit", function(event){
		event.preventDefault()
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
        console.log(group)
		// TODO: Build an SDK (e.g. a separate JS file)
        // handling the communication with the backend.

		fetch(
            //"http://localhost:8080/pl-api/groups", {
			"http://192.168.99.100:8080/pl-api/groups/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					//"Authorization": "Bearer "+ localStorage.accessToken
				},
				body: JSON.stringify(group)
			}
		).then(function(response){
			// TODO: Check status code to see if it succeeded. Display errors if it failed.
            // TODO: Update the view somehow.
            console.log("Response?????")
            goToPage(response.headers.get("Location"))
		}).catch(function(error){
			// TODO: Update the view and display error.
			console.log(error)
		})
		
    })

    document.querySelector("#update-group-page form").addEventListener("submit", function(event){
		event.preventDefault()
        
        //take in id as parameter instead?
        //const id = document.querySelector("#update-group-page .update-id-field").value

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
		// TODO: Build an SDK (e.g. a separate JS file)
		// handling the communication with the backend.
		fetch(
            //"http://localhost:8080/pl-api/groups/" + groupId, {
			"http://192.168.99.100:8080/pl-api/groups/" + group.groupId, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					//"Authorization": "Bearer "+ localStorage.accessToken
				},
				body: JSON.stringify(group)
			}
		).then(function(response){
			// TODO: Check status code to see if it succeeded. Display errors if it failed.
            // TODO: Update the view somehow.
            goToPage(response.headers.get("Location"))
		}).catch(function(error){
			// TODO: Update the view and display error.
			console.log(error)
		})
		
    })

    document.querySelector("#group-page .delete-button").addEventListener("submit", function(event){
		event.preventDefault()
        
        const id = document.querySelector("#group-page .delete-id-field").value

		
		// TODO: Build an SDK (e.g. a separate JS file)
		// handling the communication with the backend.
		fetch(
            //"http://localhost:8080/pl-api/groups/" + id, {
			"http://192.168.99.100:8080/pl-api/groups/" + id, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					//"Authorization": "Bearer "+ localStorage.accessToken
                }
			}
		).then(function(response){
			// TODO: Check status code to see if it succeeded. Display errors if it failed.
            // TODO: Update the view somehow.
            goToPage(response.headers.get("Location"))
		}).catch(function(error){
			// TODO: Update the view and display error.
			console.log(error)
		})
		
    })
    
    document.querySelector("#login-page form").addEventListener("submit", function (event) {

        console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
        event.preventDefault()

        console.log("inside login listener")

        const email = document.querySelector("#login-page .email").value
        const password = document.querySelector("#login-page .password").value

        fetch(
            //"http://localhost:8080/pl-api/accounts/tokens", {
            "http://192.168.99.100:8080/pl-api/accounts/tokens", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }, // TODO: Escape username and password in case they contained reserved characters in the x-www-form-urlencoded format.
            body: "grant_type=password&email=" + email + "&password=" + password
        }
        ).then(function (response) {
            console.log("first then() ")
            // TODO: Check status code to see if it succeeded. Display errors if it failed.
            return response.json()
        }).then(function (body) {
            // TODO: Read out information about the user account from the id_token.
            login(body.access_token)
            console.log(body.access_token)
            changeToPage("/")
        }).catch(function (error) {
            console.log(error)
        })

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

    const currentPageDiv = document.getElementsByClassName("current-page")[0]
    if (currentPageDiv) {
        currentPageDiv.classList.remove("current-page")
    }

    // TODO: Optimally this information can be put in an array instead of having a long list of if-else if statements.
    // TODO: Factor out common code in all branches.
    if (url == "/") {
        document.getElementById("home-page").classList.add("current-page")
    } else if (url == "/groups") {
        console.log("inside fetchallgroupsssssssssssssssss")
        document.getElementById("groups-page").classList.add("current-page")
        fetchAllGroups()
    } else if (url == "/sign-up") {
        document.getElementById("sign-up-page").classList.add("current-page")
    } else if (url == "/login") {
        document.getElementById("login-page").classList.add("current-page")
    }else if (new RegExp("^/group/[0-9]+/update$").test(url)){
        console.log("Do I get here? :)")
        document.getElementById("update-group-page").classList.add("current-page")
        const id = url.split("/")[2]
        updateGroup(id)
    }
    else if (new RegExp("^/group/[0-9]+$").test(url)) {
        document.getElementById("group-page").classList.add("current-page")
        const id = url.split("/")[2]
        fetchGroup(id)
    } else if (url == "/create-group") {
        document.getElementById("create-group-page").classList.add("current-page")
    }  else if (url == "/logout") {
        logout()
        document.getElementById("home-page").classList.add("current-page")
    } else {
        document.getElementById("error-page").classList.add("current-page")
    }
}


function fetchAllGroups() {

    fetch(
        //"http://localhost:8080/pl-api/groups/"
        "http://192.168.99.100:8080/pl-api/groups/"
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
    }).catch(function (error) {
        console.log(error)
    })

}

function fetchGroup(id) {


    fetch(
        //"http://localhost:8080/pl-api/groups/" + id
        "http://192.168.99.100:8080/pl-api/groups/" + id
    ).then(function (response) {
        // TODO: Check status code to see if it succeeded. Display errors if it failed.
        return response.json()
    }).then(function (response) {
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

    }).catch(function (error) {
        console.log(error)
    })
}

function updateGroup(id){
    fetch(
        //"http://localhost:8080/pl-api/groups/" + id
        "http://192.168.99.100:8080/pl-api/groups/" + id
    ).then(function (response) {
        // TODO: Check status code to see if it succeeded. Display errors if it failed.
        return response.json()
    }).then(function (response) {
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
        
    }).catch(function (error) {
        console.log(error)
    })
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