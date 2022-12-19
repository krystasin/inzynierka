const express = require('express')
const router = express.Router()

router.get("/", (req, res) => {
    res.render('stats', {
        avalibleModels: [
            'GeForce RTX 3070 Ti', 
            'GeForce RTX 3070', 
            'GeForce RTX 3060 Ti', 
            'GeForce RTX 3060', 
            'GeForce RTX 3050' 
        ],
        avalibleDomains: ['morele', 'x-kom']
    })
})

module.exports = router