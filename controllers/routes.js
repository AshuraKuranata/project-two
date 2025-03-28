const User = require('../models/users.js')
const Bird = require('../models/birds.js');
const isSignedIn = require('../middleware/is-signed-in.js');

const home = async (req, res) => {
    res.render('home.ejs');
};

const birdIndex = (isSignedIn, async (req, res) => {
    res.render('birdapp/birdindex.ejs');
})

const userCollection = (isSignedIn, async (req, res) => {
    const foundUser = User.findById(req.params.userId);
    res.render(`birdapp/usercollection.ejs`, { userCollection: foundUser })
})

module.exports = {
    home,
    birdIndex,
    userCollection,
};