const User = require('../models/users.js')
const Bird = require('../models/birds.js');
const isSignedIn = require('../middleware/is-signed-in.js');

const home = async (req, res) => {
    res.render('home.ejs');
};

const birdIndex = async (req, res) => {
    const allBirds = await Bird.find()
    res.render('birdapp/birdindex.ejs', { birds: allBirds });
}

const userCollection = async (req, res) => {
    const foundUser = User.findById(req.params.userId);
    res.render(`birdapp/usercollection.ejs`, { userCollection: foundUser })
}

const addBirdForm = async (req, res) => {
    res.render('birdapp/newbird.ejs');
}

const createBird = async (req, res) => {
    if (req.body.isNocturnal === "on") {
        req.body.isNocturnal = true;
    } else {
        req.body.isNocturnal = false;
    }
    await Bird.create(req.body);
    res.redirect('birds')
}

const editBird = async (req, res) => {
    const foundBird = await Bird.findById(req.params.birdId);
    res.render('birdapp/editbird.ejs', { bird: foundBird })
}

const updateBird = async (req, res) => {
    if (req.body.isNocturnal === "on") {
        req.body.isNocturnal = true;
    } else {
        req.body.isNocturnal = false;
    }
    await Bird.findByIdAndUpdate(req.params.birdId, req.body);
    res.redirect('/birdapp/birds')
}

const deleteBird = async (req, res) => {
    await Bird.findByIdAndDelete(req.params.birdId);
    res.redirect('/birdapp/birds')
}

module.exports = {
    home,
    birdIndex,
    userCollection,
    addBirdForm,
    createBird,
    editBird,
    updateBird,
    deleteBird
};