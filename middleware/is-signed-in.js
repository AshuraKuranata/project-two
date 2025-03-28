// Stretch - Add in functionality that stores/saves the URL a user is attempting to access and if log-in is successful, they will be redirected back to page they were logging into

const isSignedIn = (req, res, next) => {
    if (req.session.user) return next();
    res.redirect('/auth/sign-in')
}

module.exports = isSignedIn