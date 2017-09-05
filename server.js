//package and module requirements, configuarion and server starting
const express           = require('express'),
      app               = express(),
      mongoose          = require("mongoose"),
      bodyParser        = require("body-parser"),
      expressSenitizer  = require("express-sanitizer"),
      mainRoutes        = require("./routes/mainRoutes"),
      weatherRoutes     = require("./routes/weatherRoutes"),
      phonebookRoutes   = require("./routes/phonebookRoutes")

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://mongo:27017/tzach",{ useMongoClient: true })
app.use(express.static('public'))
app.use(express.static('node_modules'))
app.use(bodyParser.json())
app.use(expressSenitizer())

//TODO: Add more (and more detailed) unit tests scenarios

//TODO: Mongodb and mongoose - add fields validation (+check about Redis)

//TODO: Implement users login and authentication + Facebook session

//TODO: [Babel, Bluebird]

//routes
app.use(mainRoutes)
app.use(weatherRoutes)
app.use(phonebookRoutes)

app.listen(8000, () => {
    console.log("server port:8000")
})

app.all('*', (req, res) => {
  res.sendFile(__dirname + "/public/index.html")
  let user_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  console.log(`${(new Date).toLocaleTimeString()} : New access from IP: ${user_ip}`)
})
