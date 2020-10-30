const uuid = require('uuid')
const SHA256 = require("crypto-js/sha256")
const UserModel = require('../models/users')
const EntryModel = require('../models/entry')

// let userData = null

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
                res.redirect('/dashboard')

            })
            .catch(err => {
                console.log(err)
                res.redirect('/login')
            })
    },
    showDashboard: (req, res) => {
        let totalNeeds = 0
        let totalWants = 0
        let totalSavings = 0
        let userEntries = null

        EntryModel.find({
            email: req.session.user.email
        })
            .then(result => {
            userEntries = result
            result.forEach(item => {
                if (item.type == "needs") {
                    totalNeeds += item.amount
                } else {
                    totalWants += item.amount
                }   
            })
            UserModel.findOne({
                email: req.session.user.email
            })
                .then(result => {
                    if (!result) {
                        res.redirect('/login')
                        return
                    }
                    
                    totalSavings = result.income - totalNeeds - totalWants
                    userData = result
                    res.render('users/overview', {
                        pageTitle: 'User Dashboard',
                        username: result.username,
                        income: result.income,
                        needs: totalNeeds,
                        wants: totalWants,
                        savings: totalSavings,
                        user: userData,
                        entries: userEntries
                    })
                    
                }) 
                .catch(err => {
                    console.log(err)
                    res.redirect('/login')
                })
        }) 
        .catch(err => {
            console.log(err)
            res.redirect('/login')
        })

        
    },

    showDashboardNeeds: (req,res) => {
        EntryModel.find({
            email: req.session.user.email,
            type: "needs"
        })
        .then(result => {
            totalNeeds = calculateNeeds(result)
            res.render('users/needs', {
                pageTitle: "needs",
                needs: totalNeeds,
                entries: result
            })
        }) 
        .catch(err => {
            console.log(err)
            res.redirect('/login')
        })
    },

    showDashboardWants: (req,res) => {
        EntryModel.find({
            email: req.session.user.email,
            type: "wants"
        })
            .then(result => {
                totalWants = calculateWants(result)
                res.render('users/wants', {
                    pageTitle: "wants",
                    wants: totalWants,
                    entries: result
                })
            }) 
            .catch(err => {
                console.log(err)
                res.redirect('/login')
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
                // create new entry tag to email
                EntryModel.create(
                    {
                        email: req.session.user.email,
                        type: req.body.type,
                        amount: req.body.amount,
                        category: req.body.category,
                        tags: entryTags
                    }
                )
                .catch(err => {
                    console.log(err)
                    res.redirect('/dashboard')
                })
                // update user model with new entry
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
        EntryModel.findOne(
            {
                _id: req.params.id
            }
            )
            .then(result => {
                res.render('users/updateentry', {
                    entry: result,
                    pageTitle: "update entry"
                })
            })
            .catch(err => {
                console.log(err)
                res.redirect('/dashboard')
            })
    },
    postUpdateEntry: (req,res) => {
        let type = req.body.type
        EntryModel.updateOne(
            { 
                _id: req.params.id
            },
            {   
                type: req.body.type,
                amount: req.body.amount,
                category: req.body.category,
                tags: req.body.tags,
                updated_at: new Date()
                
            })  
            .then(result => {
                if (type == "needs") {
                    res.redirect('/dashboard/needs')
                    return
                }
                res.redirect('/dashboard/wants')
            })
            .catch(err => {
                res.redirect('/dashboard')
            })
    },
    postDeleteEntry: (req, res) => {
        EntryModel.findOne(
            {
                _id: req.params.id,
            })  
            .then(result => {
                EntryModel.deleteOne({
                    _id: req.params.id,
                })
                .catch(err => {
                    console.log(err)
                    res.redirect('/dashboard')
                })

            if(result.type == "wants") {
                res.redirect('/dashboard/wants')
                return
            }
            res.redirect('/dashboard/needs')
            })
            .catch(err => {
                console.log(err)
                res.redirect('/dashboard')
            })
    },
    
    sortedByDate: (req, res) => {
        let type = req.params.type
        EntryModel.find({
            email: req.session.user.email,
            type: type
        })
            .sort({
                "date": 1
            })

            .then(result => {
                if (type == "needs") {
                    res.render('users/needs', {
                        pageTitle: "needs",
                        needs: totalNeeds,
                        entries: result
                    })
                    return
                }
                res.redirect('/dashboard/wants')
            }) 
            .catch(err => {
                console.log(err)
                res.redirect('/login')
            })

    },
    sortedByAmount: (req, res) => {
        let type = req.params.type
        EntryModel.find({
            email: req.session.user.email,
            type: type
        })
            .sort({
                amount: 1
            })

            .then(result => {
                if (type == "needs") {
                    res.render('users/needs', {
                        pageTitle: "needs",
                        needs: totalNeeds,
                        entries: result
                    })
                    return
                }
                res.render('users/wants', {
                    pageTitle: "wants",
                    wants: totalWants,
                    entries: result
                })
            }) 
            .catch(err => {
                console.log(err)
                res.redirect('/login')
            })
    },
    sortedByCategory: (req, res) => {
        let type = req.params.type
        EntryModel.find({
            email: req.session.user.email,
            type: type
        })
            .sort({
                category: 1
            })

            .then(result => {
                if (type == "needs") {
                    res.render('users/needs', {
                        pageTitle: "needs",
                        needs: totalNeeds,
                        entries: result
                    })
                    return
                }
                res.render('users/wants', {
                    pageTitle: "wants",
                    wants: totalWants,
                    entries: result
                })
            }) 
            .catch(err => {
                console.log(err)
                res.redirect('/login')
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
// calculate Needs
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