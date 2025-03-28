const mongoose = require('mongoose')

const birdSchema = new mongoose.Schema({
    name: String,
    continent: [],
    habitat: [],
    diet: [],
    color: String,
    wingspan: Number,
    isNocturnal: Boolean,
    height: Number,
    weight: Number,
    locationSeen: String,
    dateSeen: Date,
    collections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    ]
})

const Bird = mongoose.model('Bird', birdSchema);

module.exports = Bird