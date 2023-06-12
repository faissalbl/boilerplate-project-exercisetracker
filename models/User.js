const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: { //set by the pre save middleware
        type: String,
        required: true,
    },
})

const User = mongoose.model('User', userSchema)

module.exports = User
