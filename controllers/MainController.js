const controllers = {

    redirectLandingPage: (req, res) => {
        res.redirect('/home')
    },

    showLandingPage: (req, res) => {
        res.render('onboarding/landingpage', {
            pageTitle: "Home"
        })
    },

    showLoginPage: (req, res) => {
        res.render('onboarding/login',{
            pageTitle: "Login"
        })
    },

    showRegistrationPage: (req, res) => {
        res.render('onboarding/register',{
            pageTitle: "Sign up"
        })
    }
}

module.exports = controllers