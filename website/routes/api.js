const express = require('express')
const router = express.Router()

const statsRouter = require('./api_f/statsApi')




router.use("/stats", statsRouter)

module.exports = router