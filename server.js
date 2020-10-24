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
app.use(express.static('public'))
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
app.use(setUserVarMiddleWare)

/**
 * User onboarding routes
 */
app.get('/', mainController.redirectLandingPage)
app.get('/home', mainController.showLandingPage)
app.get('/login', guestOnlyMiddleware, mainController.showLoginPage)
app.get('/register', guestOnlyMiddleware, mainController.showRegistrationPage)

app.post('/register', guestOnlyMiddleware, usersController.register)
app.post('/login', guestOnlyMiddleware, usersController.login)

/**
 * User dashboard routes
 */
app.get('/dashboard', authenticatedOnlyMiddleware, usersController.showDashboard)
app.get('/dashboard/income', authenticatedOnlyMiddleware, usersController.showDashboardIncome)
app.get('/dashboard/expenses', authenticatedOnlyMiddleware, usersController.showDashboardExpenses)
app.get('/dashboard/goals', authenticatedOnlyMiddleware, usersController.showDashboardGoals)
app.get('/test_layout', usersController.showTestLayout)

app.post('/users/newentry', usersController.newEntry)

app.post('/logout', authenticatedOnlyMiddleware, usersController.logout)


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })


function guestOnlyMiddleware(req, res, next) {
  // check if user if logged in,
  // if logged in, redirect back to dashboard
  if (req.session && req.session.user) {
    res.redirect('/dashboard')
    return // only 1 response per req
  }

  next()
}

function setUserVarMiddleWare(req, res, next) {

  // default user template variable set to null
  res.locals.user = null

  // check if  req.session.user is set,
  // if set, template user var will be set as well

  if (req.session && req.session.user) {
    res.locals.user = req.session.user
  }

  next() // pass the req to the controller

}

function authenticatedOnlyMiddleware(req, res, next) {
  if( ! req.session || ! req.session.user) {
    res.redirect('/login')
    return  
  }
  next()
}