const mongoose = require('mongoose')

const birdSchema = new mongoose.Schema({
    name: String,
    continent: String,
    habitat: String,
    diet: String,
    color: String,
    wingspan: Number,
    isNocturnal: Boolean,
    height: Number,
    weight: Number,
    locationSeen: String,
    dateSeen: Date,
})

const Bird = mongoose.model('Bird', birdSchema);

module.exports = Bird