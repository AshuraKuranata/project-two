const mongoose = require('mongoose')

const birdSchema = new mongoose.Schema({
    name: String,
    continent: [],
    habitat: [],
    diet: [],
    color: String,
    wingspan: Number,
    isNocturnal: Boolean,
    isApproved: Boolean,
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comments: [],
})

const Bird = mongoose.model('Bird', birdSchema);

module.exports = Bird