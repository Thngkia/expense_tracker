const mongoose = require('mongoose')

const entry = new mongoose.Schema({
    type: {
        required: true,
        type: String
    },
    amount: {
        required: true,
        type: Number,
    },
    category:{
        required: true,
        type: String,
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

module.exports = entry
