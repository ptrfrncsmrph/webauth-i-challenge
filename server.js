const express = require("express")
const helmet = require("helmet")
const cors = require("cors")

const authRouter = require("./auth/auth-router")
const Users = require("./users/users-model.js")
const restricted = require("./auth/restricted-middleware.js")
const session = require("./database/sessionConfig")

const server = express()

server.use(helmet())
server.use(express.json())
server.use(cors())
server.use(session)

server.use("/api/auth", authRouter)

server.get("/", (_req, res) => {
  res.send("It's alive!")
})

server.get("/api/users", restricted, (_req, res) => {
  Users.find()
    .then(users => {
      res.json(users)
    })
    .catch(err => res.send(err))
})

module.exports = server
