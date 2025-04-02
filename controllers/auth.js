const express = require('express');
const router = express.Router();
const User = require('../models/users.js')
const bcrypt = require('bcrypt')

router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs')
})

router.post('/sign-up', async (req, res) => {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
        return res.render('auth/error.ejs') // Stretch: change routine for user to stay on page with error
    }
    if (req.body.password !== req.body.confirmPassword) {
        return res.render('auth/error.ejs') // Stretch: change routine for user to stay on page with error
    }
    if (req.body.admin === "Administrator") {
        req.body.isAdmin = true
    } else {
        req.body.isAdmin = false
    };
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;
    const user = await User.create(req.body);
    req.session.user = {
        username: user.username,
        _id: user._id,
        birdCollection: user.birdCollection,
    };
    await req.session.save(() => { // Strange bug: when I try to directly go to anything user related after sign-up, it's not properly fixing
        res.redirect('/');  // FIXED: added await to req.session.save so it wouldn't go faster than the req.session.user load
    })
})

router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs');
})

router.post('/sign-in', async (req, res) => {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) { // Try Catch?
        return res.render('auth/sign-in-error.ejs')
    }
    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
    );
    if (!validPassword) {
        return res.render('auth/sign-in-error.ejs')
    }
    req.session.user = {
        username: userInDatabase.username,
        isAdmin: userInDatabase.isAdmin,
        _id: userInDatabase._id
    }
    req.session.save(() => {
        res.redirect('/')
    })
})

router.get('/edit/:userId', (req, res) => {
    res.render('auth/edit.ejs');
})

router.put('/edit/:userId', async (req, res) => {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase === userInDatabase) {
    } else if (userInDatabase) {
        return res.send('Username Already Taken.') // Stretch: change routine for user to stay on page with error
    }
    if (req.body.password !== req.body.confirmPassword) {
        return res.send('Passwords do not match, please input again with matching passwords.') // Stretch: change routine for user to stay on page with error
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;
    const updateUser = await User.findByIdAndUpdate(req.params.userId, req.body)
    req.session.user = {
        username: userInDatabase.username,
        isAdmin: userInDatabase.isAdmin,
        birdCollection: userInDatabase.birdCollection,
    };
    req.session.reload(() => {
        res.redirect('/')
    })
})

router.get('/sign-out', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

module.exports = router;