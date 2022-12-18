const express = require('express')
const router = express.Router()
const mongo = require("mongodb");

var MongoClient = require('mongodb').MongoClient;

const url = process.env.URL
const dbName = process.env.DB_NAME
const collection = process.env.STATS_COLLECTION

function getMinDate() {
    const timePerDay = 1000 * 60 * 60 * 24
    var date = new Date()
    return date.setTime(date.getTime() - (30 * timePerDay))
}


router.post("/", async (req, res) => {

    const selectedByUser = req.body
    console.log('api odebrało: ', selectedByUser);

    const minDate = new Date(getMinDate())
    const query = { date: { $gt: minDate } }
    const projection = getProjection(selectedByUser.domains, selectedByUser.models)
    console.log(query );

    MongoClient.connect(url, (err, db) => {
        if (err) res.status(500).json({ message: err.message })

        db.db(dbName).collection(collection).find(query).project(projection).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            res.json({ 
                query_result: result,
                selected: selectedByUser
            })
        });

    });

})



module.exports = router



function getProjection(domeny, modele) {
    var pro = {}
    pro['date'] = true
    domeny.forEach(d => {
        modele.forEach(m => {
            pro['stats.' + d + '.' + m] = true
        })
    });
    return pro
}








