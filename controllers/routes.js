const User = require('../models/users.js')
const Bird = require('../models/birds.js');
const isSignedIn = require('../middleware/is-signed-in.js');


// Bird App CRUD operation for bird index
const home = async (req, res) => {
    res.render('home.ejs');
};

const birdIndex = async (req, res) => {
    const allBirds = await Bird.find()
    res.render('birdapp/birdindex.ejs', { birds: allBirds });
}

const birdDetail = async (req, res) => {
    const birdDetail = await Bird.findById(req.params.birdId);
    res.render('birdapp/birddetails.ejs', {bird: birdDetail})
}

const addBirdForm = async (req, res) => {
    res.render('birdapp/newbird.ejs');
}

const requestBird = async (req, res) => {
    const user = await User.findById( req.session.user._id )
    if (req.body.isNocturnal === "on") {
        req.body.isNocturnal = true;
    } else {
        req.body.isNocturnal = false;
    }
    if (user.isAdmin === true) {
        req.body.isApproved = true
    } else {
        req.body.isApproved = false;
    }
    req.body.requester = user,
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

// CRUD Operation to relate Bird and User models 
const userCollection = async (req, res) => {
    const userId = await User.findById( req.session.user._id ).populate('birdCollection').exec()
    const userCollection = userId.birdCollection
    // console.log(user[0].birdCollection) // NEED TO CHANGE LOGGED DATA FROM AN ARRAY INTO SINGLE OBJECT
    res.render(`birdapp/usercollection.ejs`, { birds: userCollection })
}

const selectBirdCollection = async (req, res) => {
    const allBirds = await Bird.find();
    const userId = await User.findById( req.session.user._id ).populate('birdCollection').exec()
    const userCollection = userId.birdCollection
    console.log(userCollection);
    res.render('birdapp/editcollection.ejs', { birds: allBirds, collection: userCollection })
}

const addCollection = async (req, res) => {
    const birdId = await Bird.findById(req.body.birdCollection);
    const userName = await User.findOneAndUpdate(
        { username: req.session.user.username },
        { $addToSet: {birdCollection: birdId} }, // $push is command for Mongoose and MongoDB that pushes the object to end of array instead of updating existing values.  $addToSet does what $push does but prevents duplications of the same entry!
        { new: true},
    )
    res.redirect('/birdapp/collection')    
}

// const editCollection = async (req, res) => {
//     const birdId = await Bird.findById(req.body.birdCollection);
//     const userId = await User.findOneAndUpdate(
//         { username: req.session.user.username },
//         { birdCollection: birdId },
//         { new: true },
//     );
//     console.log('Updated Document:', addCollection);
//     res.redirect(`/birdapp/collection`)
// }

const deleteCollectionBird = async (req, res) => {
    const birdId = req.body.birdCollectionRemove;
    console.log(birdId);
    const userId = await User.findOneAndUpdate(
        { username: req.session.user.username },
        { $pull: { birdCollection: birdId } }, // $pull: remove all items with the referenced object ID 
        { new: true },
    );
    console.log("Updated User Collection:", userId.birdCollection);
    res.redirect('/birdapp/collection')
}

// Administrator Page

const adminPage = async (req, res) => {
    const allUsers = await User.find().populate('birdCollection').exec();
    const birdRequests = await Bird.find().populate('requester').exec();
    res.render('admin.ejs', { users: allUsers, birdReq: birdRequests })
}

const deleteUser = async (req, res) => {
    const userId = await User.findByIdAndDelete(req.params.userId);
    res.redirect('/admin')
}

const createBird = async (req, res) => {
    if (req.body.isApproved === "on") {
        req.body.isApproved = true;
        await Bird.findByIdAndUpdate(req.params.birdId, req.body);
    } else {
        await Bird.findByIdAndDelete(req.params.birdId);
    }
    res.redirect('/admin')
}

/*  Bad Code - was trying to create a forEach to verify
userCheck.birdCollection.forEach((birdCheck) => {
    if (birdCheck.id === birdId.id) {
        res.redirect('/birdapp/collection')
        return
    } else {      
    }
})

Bad Code: Issues with calling the right objects for being updated correctly.
Issue resolution : birdId is already called as part of the object, so it doesn't need to be called again from the model.  Rather it should just be requested from the model: req.body.birdCollectionRemove
const deleteCollectionBird = async (req, res) => {
    const birdId = await Bird.findById(req.body.birdCollectionRemove);
    const userId = await User.findOneAndUpdate(
        { username: req.session.user.username },
        { $pull: { birdCollection: birdId._id } },
        { new: true },
    );
    console.log("Updated User Collection:", userId.birdCollection);
    res.redirect('/birdapp/collection')
}
*/


module.exports = {
    home,
    birdIndex,
    userCollection,
    addBirdForm,
    requestBird,
    editBird,
    updateBird,
    deleteBird,
    addCollection,
    selectBirdCollection,
    // editCollection,
    deleteCollectionBird,
    adminPage,
    createBird,
    deleteUser,
    birdDetail,
};