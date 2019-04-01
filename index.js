const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const bcrypt = require("bcryptjs")

const db = require("./database/dbConfig.js")
const Users = require("./users/users-model.js")

const server = express()

server.use(helmet())
server.use(express.json())
server.use(cors())

server.get("/", (_req, res) => {
  res.send("It's alive!")
})

server.post("/api/register", (req, res) => {
  let user = req.body

  const hash = bcrypt.hashSync(user.password, 4)
  user.password = hash

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved)
    })
    .catch(error => {
      res.status(500).json(error)
    })
})

server.post("/api/login", (req, res) => {
  let { username, password } = req.body

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` })
      } else {
        res.status(401).json({ message: "Invalid Credentials" })
      }
    })
    .catch(error => {
      res.status(500).json(error)
    })
})

server.get("/api/users", readUserFrom("headers"), (_req, res) => {
  Users.find()
    .then(users => {
      res.json(users)
    })
    .catch(err => res.send(err))
})

function readUserFrom(prop) {
  return function restricted(req, res, next) {
    let { username, password } = req[prop]
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next()
        }
      })
      .catch(() => {
        res.send(500).json({ message: "Something went wrong!" })
      })
  }
}

function only(username) {
  return (req, res, next) => {
    username.toUpperCase() === req.headers.username.toUpperCase()
      ? next()
      : res.send(401).json({ message: "Invalid Credentials" })
  }
}

const port = process.env.PORT || 5000
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`))
