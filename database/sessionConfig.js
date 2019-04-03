const knex = require("../database/dbConfig")
const session = require("express-session")
const KnexSessionStore = require("connect-session-knex")(session)

const MINUTE = 1000 * 60

module.exports = session({
  name: "webauth-ii",
  secret:
    "d5574e1962c66aed3669e4f4bf2e60f4df6fea061bcad39418fe931421de255946d11f54fbdd07ab2e9f80210980e298",
  cookies: {
    maxAge: 10 * MINUTE,
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUnitialized: false,
  store: new KnexSessionStore({
    knex,
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 30 * MINUTE
  })
})
