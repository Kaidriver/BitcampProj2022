const express = require('express')
const router = express.Router()
const controller = require('../controllers/controller')

router.get('/getDailyInfo', controller.getData)
module.exports = router
