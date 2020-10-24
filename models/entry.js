const mongoose = require('mongoose')

const entrySchema = new mongoose.Schema({
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
const EntryModel = mongoose.model('Entry', entrySchema)

module.exports = EntryModel
