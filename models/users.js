const mongoose = require('mongoose')
const entry = require('./entry')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        max: 100
    },
    email: {
        type: String,
        required: true,
        max: 100,
        unique: true
    },
    pwsalt: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel
