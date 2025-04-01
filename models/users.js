const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
    },
    birdCollection: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bird',
            required: true,
        },
    ],
})

const User = mongoose.model('User', userSchema);

module.exports = User