exports.getData = (req, res) => {
  const getCurrentData = require("../app.js")
  res.send(getCurrentData)
}
