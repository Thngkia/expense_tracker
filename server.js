require('dotenv').config()
const express = require('express')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const session = require('express-session')
const mainController = require('./controllers/MainController')
const usersController = require('./controllers/UsersController')
const app = express();
const port = 4000;

const mongoURI = 'mongodb://localhost:27017/expense_tracker'
const db = mongoose.connection

mongoose.set('useFindAndModify', false)
mongoose.connect( mongoURI, { useNewUrlParser: true, useUnifiedTopology: true } )

app.set('view engine', 'ejs')
app.use(express.urlencoded({
  extended: true
}))

app.use(session({
  secret: process.env.SESSION_SECRET,
  name: "app_session",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 3600000 } 
}))

// app.use(setUserVarMiddleWare)

/**
 * User onboarding routes
 */
app.get('/', mainController.redirectLandingPage)
app.get('/home', mainController.showLandingPage)
app.get('/login', mainController.showLoginPage)
app.get('/register', mainController.showRegistrationPage)

app.post('/users/register', usersController.register)
app.post('/users/login', usersController.login)

/**
 * User dashboard routes
 */
app.get('/dashboard', usersController.showDashboard)



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })