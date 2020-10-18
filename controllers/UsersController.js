const uuid = require('uuid')
const SHA256 = require("crypto-js/sha256")
const UserModel = require('../models/users')

const controllers = {
    
    register: (req, res) => {
        // validate the users input
        // not implemented yet, try on your own
        UserModel.findOne({
            email: req.body.email
        })
            .then(result => {
                // if found in DB, means email has already been take, redirect to registration page
                if (result) {
                    res.redirect('/register')
                    return
                }

                // no document found in DB, can proceed with registration

                // generate uuid as salt
                const salt = uuid.v4()

                // hash combination using bcrypt
                const combination = salt + req.body.password

                // hash the combination using SHA256
                const hash = SHA256(combination).toString()

                // create user in DB
                UserModel.create({
                    username: req.body.username,
                    email: req.body.email,
                    pwsalt: salt,
                    hash: hash
                })
                    .then(createResult => {
                        res.redirect('/login')
                    })
                    .catch(err => {
                        res.redirect('/register')
                    })
            })
            .catch(err => {
                console.log(err)
                res.redirect('/register')
            })
    },
    login: (req, res) => {
        console.log(req.body)
        UserModel.findOne({
            email: req.body.email
        })
            .then(result => {
                // check if result is empty
                if (!result) {
                    res.redirect('/login')
                    return
                }

                // combine DB salt with given pw, and apply hashing algo
                const hash = SHA256(result.pwsalt + req.body.password).toString()

                // check if pw is correct by comparing hashes
                if (hash !== result.hash) {
                    res.redirect('/login')
                    return
                }
                // login successful
                
                // set session user 
                req.session.user = result

                console.log(req.session)

                res.redirect('/dashboard')

            })
            .catch(err => {
                console.log(err)
                res.redirect('/login')
            })
    },
    showDashboard: (req, res) => {

        res.render('users/dashboard', {
            pageTitle: 'User Dashboard'
        })
    },

    logout: (req, res) => {
        req.session.destroy()
        res.redirect('/users/login')
    }
    
}

module.exports = controllers