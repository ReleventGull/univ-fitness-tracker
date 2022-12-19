require("dotenv").config()
const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require("cors")
// Setup your Middleware and API Router here
const { client } = require("./db")


app.use(morgan("dev"))
app.use(express.json())
app.use(cors())





app.use('/health', (req, res, next) => {
    res.send("I'm healthy")
    next()
})
const router = require('./api/index')
app.use('/api', router)




app.use((req,res,next) => {
    res.status(401)
    res.send("You must be logged in to perform this action")
})
app.use((error, req, res, next) => {
    res.status(500)
    res.send({
        error: error.message,
        name: error.name,
        message: error.message
    })
})



module.exports = app;