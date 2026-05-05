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
router.get('/42/callback', passport.authenticate('42', { session: false }), (req, res) => {

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