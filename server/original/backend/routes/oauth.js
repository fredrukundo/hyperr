require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('../config/passport');

const router = express.Router();

const generateJWT = (id, username) => {
    return jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: '5d' });
};

/**
 * STEP 1: Login route → redirects to 42
 */
router.get('/42', passport.authenticate('42'));

/**
 * STEP 2: Callback route → 42 redirects here
 */
router.get('/42/callback', (req, res, next) => {

    passport.authenticate(
        '42',
        { session: false },
        (err, user) => {

            if (err || !user) {

                return res.redirect(
                    `http://localhost:3000/auth/error?message=${encodeURIComponent(
                        'Authentication failed'
                    )}`
                );
            }

            try {

                const token = generateJWT(user.id, user.username);

                return res.redirect(
                    `${process.env.FRONTEND_URL}/auth/success?token=${token}`
                );

            } catch (error) {

                return res.redirect(
                    `http://localhost:3000/auth/error?message=${encodeURIComponent(
                        'Internal server error'
                    )}`
                );
            }
        }
    )(req, res, next);
});

/**
 * STEP 1: Login route → redirects to github
 */
router.get('/github',
    passport.authenticate('github', { scope: ['user:email'] })
);

/**
 * STEP 2: Callback route → github redirects here
 */
router.get('/github/callback', passport.authenticate('github', { session: false }), (req, res) => {
    const token = generateJWT(user.id, user.username);

    return res.redirect(
        `${process.env.FRONTEND_URL}/auth/success?token=${token}`
    );
}
);

/**
 * STEP 1: Login route → redirects to discord
 */
router.get('/discord',
    passport.authenticate('discord')
);

/**
 * STEP 2: Callback route → discord redirects here
 */
router.get('/discord/callback', passport.authenticate('discord', { session: false }), (req, res) => {

    const token = generateJWT(req.user.id, req.user.username);

    return res.status(200).json({
        token,
        user: {
            id: req.user.id,
            username: req.user.username,
            email: req.user.email
        }
    });
}
);


module.exports = router