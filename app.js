const express = require('express')
const app = express()
const routes = require('./routes/route')
require('dotenv').config()

app.use('/', routes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Listening to port: " + PORT)
})
