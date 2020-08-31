const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');

const userRouter = express.Router();
userRouter.use(bodyParser.json());
userRouter.get('/', authenticate.verifyUser, authenticate.verifyAdmin, getUsers);
userRouter.post('/signup', registerUser);
userRouter.post('/login', passport.authenticate('local'), loginUser);
userRouter.get('/logout', logoutUser);

async function getUsers (req, res) {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(`Could not find user!`)
    }
}   
      
async function registerUser (req, res) {
    try {
        const user = await User.register(new User({ 
            username: req.body.username, 
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email
        }),
        req.body.password);
        const saved = await user.save;
        passport.authenticate('local')(req, res, () => {
            res.status(200).json({ success: true, status: 'Registration Successful!' });
        });
    } catch {
        res.status(500).json(`Could not register user!`)
    }
}

async function loginUser (req, res) {
    try {
        const token = authenticate.getToken({ _id: req.user._id });
        res.status(200).json({
            success: true,
            token: token,
            status: 'You are successfully logged in!',
        });
    } catch (err) {
        res.status(500).json(`Could not log in user!`)
    }
}

async function logoutUser (req, res) {
    try {
        if (req.session) {  //JWT 
            req.session.destroy();
            res.clearCookie('session-id');
            res.redirect('/');
            res.status(200);
        } else {
            res.status(401).json(`You are not logged in!`);
        }
    } catch (err) {
        res.status(500).json(`Could not log out!`);
    }
}

module.exports = userRouter;