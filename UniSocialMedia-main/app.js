const express = require('express')
const passport = require('passport')
const mongoose = require('mongoose')
const session = require('express-session')
const User = require('./models/User')
require('dotenv').config()

const app = express()
app.set('view engine', 'ejs')   
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use(session({
    secret: "cats",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
//--------------------------------GOOGLE LOGIN-----------------------------------

app.use(passport.initialize())
app.use(passport.session())

require('./gmaillogin')

app.use('/auth/google', require('./route/google'))



//--------------------------------GOOGLE LOGIN-----------------------------------
app.get('/', (req, res) => {
    res.redirect('/login')
})

app.use('/dashboard', require('./route/dashboard'))
app.use('/login',require('./route/login'))


const http = require('http').createServer(app)
const io = require('socket.io')(http)
mongoose.connect(process.env.MONGODB_CONNECTION,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => {
        console.log('MONGODB CONNECTED')
        http.listen(process.env.PORT, () => {
            console.log('http://localhost:'+process.env.PORT+"/login")

            io.on("connection", (socket) => {

                socket.on("messageSent", (message) => {
                    socket.broadcast.emit("messageSent", message)
                })
            })
        })
    })
    .catch(e => console.log('Can\'t connect to database '+ e.message))