const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: Boolean,
    // birdCollection:
})

const User = mongoose.model('User', userSchema);

module.exports = User