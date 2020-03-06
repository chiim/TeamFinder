// TODO: Don't write all JS code in the same file.
document.addEventListener("DOMContentLoaded", function(){
    
    changeToPage(location.pathname)

    console.log(localStorage.accessToken)
	
	if(localStorage.accessToken){
        console.log("finns accestoken? ")
		login(localStorage.accessToken)
	}else{
        console.log("else logout")
		logout()
	}
	
	document.body.addEventListener("click", function(event){
		if(event.target.tagName == "A"){
			event.preventDefault()
			const url = event.target.getAttribute("href")
			goToPage(url)
		}
	})
	/*
	// TODO: Avoid using this long lines of code.
	document.querySelector("#create-pet-page form").addEventListener("submit", function(event){
		event.preventDefault()
		
		const name = document.querySelector("#create-pet-page .name").value
		
		const pet = {
			name
		}
		
		// TODO: Build an SDK (e.g. a separate JS file)
		// handling the communication with the backend.
		fetch(
			"http://localhost:8080/pets", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer "+ localStorage.accessToken
				},
				body: JSON.stringify(pet)
			}
		).then(function(response){
			// TODO: Check status code to see if it succeeded. Display errors if it failed.
			// TODO: Update the view somehow.
			console.log(response)
		}).catch(function(error){
			// TODO: Update the view and display error.
			console.log(error)
		})
		
	})
    
    */
	document.querySelector("#login-page form").addEventListener("submit", function(event){
       
        console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
        event.preventDefault()
        
        console.log("inside login listener")
		
		const email = document.querySelector("#login-page .email").value
		const password = document.querySelector("#login-page .password").value
		
		fetch(
			"http://192.168.99.100:8080/pl-api/accounts/tokens", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}, // TODO: Escape username and password in case they contained reserved characters in the x-www-form-urlencoded format.
				body: "grant_type=password&email="+email+"&password="+password
			}
			).then(function(response){
                console.log("first then() ")
				// TODO: Check status code to see if it succeeded. Display errors if it failed.
				return response.json()
			}).then(function(body){
				// TODO: Read out information about the user account from the id_token.
                login(body.access_token)   
                console.log(body.access_token)
                changeToPage("/")
		}).catch(function(error){
			console.log(error)
		})
		
	})
	
})

window.addEventListener("popstate", function(event){
	const url = location.pathname
	changeToPage(url)
})

function goToPage(url){
	
	changeToPage(url)
	history.pushState({}, "", url)
	
}

function changeToPage(url){
	
	const currentPageDiv = document.getElementsByClassName("current-page")[0]
	if(currentPageDiv){
		currentPageDiv.classList.remove("current-page")
	}
	
	// TODO: Optimally this information can be put in an array instead of having a long list of if-else if statements.
	// TODO: Factor out common code in all branches.
	if(url == "/"){
		document.getElementById("home-page").classList.add("current-page")
	}else if(url == "/groups"){
        console.log("inside fetchallgroupsssssssssssssssss")
        document.getElementById("groups-page").classList.add("current-page")
        fetchAllGroups()
	}else if(url == "/sign-up"){
		document.getElementById("sign-up-page").classList.add("current-page")
	}else if(url == "/login"){
        document.getElementById("login-page").classList.add("current-page")
    }
    else if(new RegExp("^/group/[0-9]+$").test(url)){
		document.getElementById("group-page").classList.add("current-page")
        const id = url.split("/")[2]
		fetchGroup(id)
	}else if(url == "/create-pet"){
		document.getElementById("create-pet-page").classList.add("current-page")
    }else if(url == "/logout"){
        logout()
		document.getElementById("home-page").classList.add("current-page")
    }else{
		document.getElementById("error-page").classList.add("current-page")
	}
}


function fetchAllGroups(){

	fetch(
		"http://192.168.99.100:8080/pl-api/groups/"
	).then(function(response){
        console.log("inside fetchallgroupsssssssssssssssss")
		// TODO: Check status code to see if it succeeded. Display errors if it failed.
		return response.json()
	}).then(function(groups){
		const ul = document.querySelector("#groups-page ul")
		ul.innerText = ""
		for(const group of groups){
			const li = document.createElement("li")
            const anchor = document.createElement("a")
            const pSport = document.createElement("p")
            const pCity = document.createElement("p")
            pSport.innerText = group.sport
            pCity.innerText = group.city
			anchor.innerText = group.name
			anchor.setAttribute("href", '/group/'+ group.groupId)
            li.appendChild(anchor)
            li.append(pSport)
            li.append(pCity)
			ul.append(li)
		}
	}).catch(function(error){
		console.log(error)
	})
	
}

function fetchGroup(id){

	
	fetch(
		"http://localhost:8080/pl-api/groups/"+id
	).then(function(response){
		// TODO: Check status code to see if it succeeded. Display errors if it failed.
		return response.json()
	}).then(function(group){
		const nameSpan = document.querySelector("#group-page .name")
        const sportSpan = document.querySelector("#group-page .sport")
        const nrOfMembersSpan = document.querySelector("#group-page .nrOfMembers")
		const memberSlotsSpan = document.querySelector("#group-page .memberSlots")
		const citySpan = document.querySelector("#group-page .city")
		const maxAgeSpan = document.querySelector("#group-page .maxAge")
		const minAgeSpan = document.querySelector("#group-page .minAge")
		const skillLevelSpan = document.querySelector("#group-page .skillLevel")
		const allowedGenderSpan = document.querySelector("#group-page .allowedGender")

		nameSpan.innerText = group.name
        sportSpan.innerText = group.id
        nrOfMembersSpan.innerText = group.nrOfMembers
        memberSlotsSpan.innerText = group.memberSlots
        citySpan.innerText = group.city
        maxAgeSpan.innerText = group.maxAge
        minAgeSpan.innerText = group.minAgeSpan
        skillLevelSpan.innerText = group.skillLevel
        allowedGenderSpan.innerText = group.allowedGender

        
        const payload = jwt.verify(localStorage.accessToken, serverSecret)

        if(payload.accountId == group.authorId){
        
            const deleteButton = document.querySelector("#group-page .delete-button")
            const updateButton = document.querySelector("#group-page .update-button")

            deleteButton.classList.remove("showIfAuthor")
            deleteButton.classList.add("isAuthor")
            updateButton.classList.remove("showIfAuthor")
            updateButton.classList.add("isAuthor")
            
        }

        
	}).catch(function(error){
		console.log(error)
	})
}

function login(accessToken){
	localStorage.accessToken = accessToken
	document.body.classList.remove("isLoggedOut")
	document.body.classList.add("isLoggedIn")
}

function logout(){
	localStorage.accessToken = ""
	document.body.classList.remove("isLoggedIn")
	document.body.classList.add("isLoggedOut")
}