const jwt = require('jsonwebtoken')
const express = require('express')

module.exports = function ({ accountManager }) {

    const router = express.Router()

    router.post('/', function (request, response) {

        const googleId = request.body.googleId
        const firstName = request.body.firstName
        const lastName = request.body.lastName
        const email = request.body.email
        const password = request.body.password
        const age = request.body.age
        const city = request.body.city
        const gender = request.body.gender
        account = {
            googleId,
            firstName,
            lastName,
            email,
            password,
            age,
            city,
            gender
        }
        accountManager.createAccount(account, function (errors, id) {
            if (errors && errors.includes("databaseError")) {
                response.status(500).json(errors)
            } else if (errors && 0 < errors.length) {
                response.status(400).json(errors)
            } else {
                response.setHeader("Location", "/accounts/" + id)
                response.status(201).end()
            }
        })

    }),

        router.post("/tokens", function (request, response) {
            const serverSecret = "sdfkjdslkfjslkfd"

            const grantType = request.body.grant_type

            const email = request.body.email
            const password = request.body.password


            if (grantType != "password") {
                response.status(400).json({ error: "unsupported_grant_type" })
                return
            }
            accountManager.loginAccount(email, password, function (errors, account) {

                if (errors) {
                    console.log(errors)
                }

                if (errors && errors.includes("DatabaseError")) {
                    response.status(500).json(errors)
                } else if (errors && 0 < errors.length) {
                    console.log(errors)
                    response.status(400).json(errors) //this looks so scuffed
                } else {

                    const payload = { accountId: account.accountId } // ifAdmin

                    const accessToken = jwt.sign(payload, serverSecret)



                    const idToken = jwt.sign(
                        { sub: account.accountId },
                        serverSecret
                    )


                    response.status(200).json({
                        access_token: accessToken,
                        id_token: idToken
                    })
                }

            })


        }),

        router.get('/:id', function(request, response){
            const googleId = request.params.id

            accountManager.getAccountByGoogleId(googleId, function(error, account){
                if(error){
                    console.log("error: ", error)
                    response.status(500).json(error)
                }
                else if (account == null){
                    response.status(204).end()
                }
                else{
                    response.status(200).json(account)
                }
            })
            
        })

    return router

}