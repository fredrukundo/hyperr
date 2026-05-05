const passport = require('../config/passport')

const isAuthorize = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || !user){
            return res.status(401).json({ error: { code: 'NOT_AUTHENTICATED'}});
        }
        req.user = user
        next()
    })(req, res, next)
}

module.exports = isAuthorize