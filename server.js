// Calls to installed modules
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const session = require('express-session')
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const MongoStore = require('connect-mongo')
const birdCtrl = require('./controllers/routes.js')
const userCtrl = require('./controllers/auth.js'); // Calls the controller routes set in auth.js file
const router = require('./controllers/auth.js');
const isSignedIn = require('./middleware/is-signed-in.js')
const passUserToView = require('./middleware/pass-user-to-view.js')
const path = require('path');

const Bird = require('./models/birds.js');
const User = require('./models/users.js');

// Connection for application to MongoDB
const port = process.env.PORT ? process.env.PORT : "3040"; // Allows different port calls, default to 3040
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
        }),
    }),
);
app.use(passUserToView)
app.use(express.static(path.join(__dirname, 'public'))); // Call for static files like JS, CSS, and others to run after EJS files render


// Application programs
app.get('/', birdCtrl.home); // Navigation to home page
app.get('/birdapp/birds', isSignedIn, birdCtrl.birdIndex) // Navigation to the Bird Index
app.get('/birdapp/collection', isSignedIn, birdCtrl.userCollection) // Navigation to user's collection 
app.get('/birdapp/newbird', isSignedIn, birdCtrl.addBirdForm)
app.post('/birdapp/birds', isSignedIn, birdCtrl.createBird)
app.get('/birdapp/birds/:birdId/edit', isSignedIn, birdCtrl.editBird)
app.put('/birdapp/birds/:birdId', isSignedIn, birdCtrl.updateBird)
app.delete('/birdapp/birds/:birdId', isSignedIn, birdCtrl.deleteBird)


app.use('/auth', userCtrl) // Calls authentication routes built in controllers/auth.js  

app.listen(port, () => {
    console.log(`The app is ready on port ${port}`)
})