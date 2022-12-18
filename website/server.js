


require('dotenv').config({ path: require('find-config')('.env') })
const express = require("express");
const app = express()
const  path = require('path')
const favicon = require('serve-favicon');


app.use(logger)
app.set('view engine', 'ejs')


app.use('/favicon.ico', express.static('./public/favicon.ico'));
app.use("/public", express.static('./public/'));
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get("/public/styles/style.css");


const indexRouter = require('./routes/index')
const pricesRouter = require('./routes/statsView')
const apiRouter = require('./routes/api')




app.use("/", pricesRouter)
app.use("/api", apiRouter)




app.use("/", (req, res) => {
    res.statusCode = 404
    res.send("ERROR 404")
})


app.listen(3000)




function logger(req, res, next){
    console.log(req.originalUrl);
    next()
}