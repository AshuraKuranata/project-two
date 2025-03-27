// Calls to installed modules
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const path = require('path');
const port = process.env.PORT ? process.env.PORT : "3040"; // Allows different port calls, default to 3040
const Bird = require('./models/birds.js');
const User = require('./models/users.js');

// Connection for application to MongoDB
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public'))); // Call for static files like JS, CSS, and others to run after EJS files render

// Application programs

app.listen(port, () => {
    console.log(`The app is ready on port ${port}`)
})