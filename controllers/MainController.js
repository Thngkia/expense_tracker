const controllers = {

    redirectLandingPage: (req, res) => {
        res.redirect('/home')
    },

    showLandingPage: (req, res) => {
        res.render('onboarding/landingpage')
    },

    showLoginPage: (req, res) => {
        res.render('onboarding/login')
    },

    showRegistrationPage: (req, res) => {
        res.render('onboarding/register')
    }
}

module.exports = controllers