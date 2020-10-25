require('dotenv').config()
const express = require('express')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const session = require('express-session')
const mainController = require('./controllers/MainController')
const usersController = require('./controllers/UsersController')
const app = express();
const port = process.env.PORT || 4000;

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`
mongoose.set('useFindAndModify', false)

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(methodOverride('_method'))
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


mongoose.connect( mongoURI, { useNewUrlParser: true, useUnifiedTopology: true } )
  .then(response => {
    // DB connected successfully
    console.log('DB connection successful')

    app.listen(process.env.PORT || port, () => {
      console.log(`Expense tracker listening on port: ${port}`)
    })
  })
  .catch(err => {
    console.log(err)
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