require("dotenv").config()
const express = require("express")
const app = express()
const morgan = require("morgan")

// Setup your Middleware and API Router here
const { client } = require("./db")
const apiRouter = express.Router()

app.use(morgan("dev"))
app.use(express.json())


app.use("/api", apiRouter)

module.exports = app;