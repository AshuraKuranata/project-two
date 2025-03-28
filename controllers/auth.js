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
        return res.send('Username Already Taken.') // Stretch: change routine for user to stay on page with error
    }
    if (req.body.password !== req.body.confirmPassword) {
        return res.send('Passwords do not match, please input again with matching passwords.') // Stretch: change routine for user to stay on page with error
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;
    const user = await User.create(req.body);
    req.session.user = {
        username: user.username,
    };
    req.session.save(() => {
        res.redirect('/');
    })
})

router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs');
})

router.post('/sign-in', async (req, res) => {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
        return res.send('Incorrect Username or Password. Please try again.')
    }
    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
    );
    if (!validPassword) {
        return res.send('Incorrect Username or Password. Please try again.')
    }
    req.session.user = {
        username: userInDatabase.username,
        _id: userInDatabase._id
    }
    req.session.save(() => {
        res.redirect('/')
    })
})

router.get('/sign-out', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

module.exports = router;