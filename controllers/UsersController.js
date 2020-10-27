const uuid = require('uuid')
const SHA256 = require("crypto-js/sha256")
const UserModel = require('../models/users')
const EntryModel = require('../models/entry')
let totalNeeds = 0
let totalWants = 0
let totalSavings = 0
let userData = null

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
                    income: req.body.income,
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

                //console.log(req.session)

                res.redirect('/dashboard')

            })
            .catch(err => {
                console.log(err)
                res.redirect('/login')
            })
    },
    showDashboard: (req, res) => {
        UserModel.findOne({
            email: req.session.user.email
        })
            .then(result => {
                if (!result) {
                    res.redirect('/login')
                    return
                }

                totalNeeds = calculateNeeds(result.entry)
                totalWants = calculateWants(result.entry)
                totalSavings = result.income - totalNeeds - totalWants
                userData = result
                // console.log(totalNeeds, totalWants, totalSavings, result.entry)
                res.render('users/overview', {
                    pageTitle: 'User Dashboard',
                    username: result.username,
                    income: result.income,
                    needs: totalNeeds,
                    wants: totalWants,
                    savings: totalSavings,
                    user: userData
                })
            }) 
            .catch(err => {
                console.log(err)
                res.redirect('/login')
            })
    },
    showDashboardIncome: (req,res) => {
        res.render('users/income', {
            pageTitle: "Income",
            income: userData.income
        })
    },

    showDashboardExpenses: (req,res) => {
        res.render('users/expenses', {
            pageTitle: "Expense",
            user: userData
        })
    },

    showDashboardGoals: (req,res) => {
        res.render('users/goals', {
            pageTitle: "Goals"
        })
    },

    showDashboardNeeds: (req,res) => {
        res.render('users/needs', {
            pageTitle: "needs",
            needs: totalNeeds,
            user: userData
        })
    },

    showDashboardWants: (req,res) => {
        res.render('users/wants', {
            pageTitle: "wants",
            wants: totalWants,
            user: userData
        })
    },

    newEntry: (req,res) => {
        UserModel.findOne({
            email: req.session.user.email
        })
            .then(result => {
                if (!result) {
                    console.log('no result')
                    res.redirect('/dashboard')
                    return
                }
                let entryTags = req.body.tags.split(" ")
            
                UserModel.update(
                    {
                        // find the user using session email
                        email: req.session.user.email
                    },
                    {
                        // push entry into entry array 
                        $push: 
                        { 
                            'entry': {
                                type: req.body.type,
                                amount: req.body.amount,
                                category: req.body.category,
                                tags: entryTags
                            }
                        }
                    }
                )
                .then(updateResult => {
                    console.log("updated")
                    res.redirect('/dashboard')
                })
                .catch(err => {
                    console.log(err)
                    res.redirect('/dashboard')
                })
            })
            .catch(err => {
                console.log(err)
                res.redirect('/dashboard')
            })
    },

    updateIncome: (req,res) => {
        UserModel.findOneAndUpdate(
            {
                email: req.session.user.email
            },
            {
                income: req.body.income
            }
            )
            .then(updateResult => {
                res.redirect('/dashboard')
            })
            .catch(err => {
                console.log(err)
                res.redirect('/dashboard')
            })
    },
    showUpdateEntry: (req,res) => {
        UserModel.findOne(
            {
                email: req.session.user.email
            }
            )
            .then(result => {
                let entry = result.entry.filter(item => item.id == req.params.id)
                console.log(entry)
                res.render('users/updateentry', {
                    entry: entry[0],
                    pageTitle: "update entry"
                })
            })
            .catch(err => {
                console.log(err)
                res.redirect('/dashboard')
            })
    },
    postUpdateEntry: (req,res) => {
        // console.log(req.body, req.params.id, req.session.user.email)
        UserModel.updateOne(
            {
                email: req.session.user.email, 
                "entry._id": req.params.id
            },
            {   
                $set: 
                { 
                    "entry.$.type" : req.body.type,
                    "entry.$.amount" : req.body.amount, 
                    "entry.$.category" : req.body.category, 
                    "entry.$.tags" : req.body.tags,
                    // "entry.$.updated_at": new Date() 
                }
            })  
            .then(result => {
                res.redirect('/dashboard')
            })
            .catch(err => {
                res.redirect('/dashboard')
            })
    },
    postDeleteEntry: (req, res) => {
        UserModel.updateOne(
            {
                email: req.session.user.email,
            },
            {   
                $pull: 
                { 
                    entry: {
                        "_id":  req.params.id
                    }
                }
            })  
            .then(result => {
                console.log(result)
                res.redirect('/dashboard')
            })
            .catch(err => {
                console.log(err)
                res.redirect('/dashboard')
            })
    },

    logout: (req, res) => {
        req.session.destroy()
        res.redirect('/login')
    },
    showTestLayout: (req, res) => {
        res.render("users/test_layout")
    }
}

// calculate EXPENSE
let calculateWants = (entry) => {
    // console.log(entry.length)
    if (entry.length == 0) {
        return 0
    }
    let total = 0 
    entry.forEach(item => {
        if (item.type == "wants") {
            total += item.amount
        }
    })
    return total
}
// calculate INCOME
let calculateNeeds = (entry) => {
    if (entry.length == 0) {
        return 0
    }
    let total = 0
    entry.forEach(item => {
        if (item.type == "needs") {
            total += item.amount
        }
    })
    return total
}

module.exports = controllers