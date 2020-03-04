const jwt = require('jsonwebtoken')
const express = require('express')

module.exports = function ({ accountManager }) {

    const router = express.Router()

    router.post('/', function (request, response) {
        console.log("Testar att logga?")
        const firstName = request.body.firstName
        const lastName = request.body.lastName
        const email = request.body.email
        const password = request.body.password
        const age = request.body.age
        const city = request.body.city
        const gender = request.body.gender
        account = {
            firstName,
            lastName,
            email,
            password,
            age,
            city,
            gender
        }
        console.log("Kolla account innan repo: ", account)
        accountManager.createAccount(account, function (error, id) {
            if (errors.includes("databaseError")) {
                response.status(500).end()
            } else if (0 < errors.length) {
                response.status(400).json(error)
            } else {
                response.setHeader("Location", "/accounts/" + id)
                response.status(201).end()
            }
        })

    })

    return router

}