const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');

const userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter
    .route('/')
    .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        User.find()
            .then((users) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(users);
            })
            .catch((err) => next(err));
    });

userRouter
    .route('/signup')
    .post((req, res) => {
        User.register(
            new User({ username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname }),
            req.body.password,
            err => {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({err: err});
                } else {
                    passport.authenticate('local')(req, res, () => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: true, status: 'Registration Successful!'});
                    })
                }
            }
        );
    });
 
userRouter
    .route('/login')
    .post(passport.authenticate('local'), (req, res) => {
        const token = authenticate.getToken({_id: req.user._id});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, token: token, status: 'You are successfully logged in!'});
    })

userRouter
    .route('/logout')
    .get((req, res, next) => {
        if (req.session) {  //JWT 
            req.session.destroy();
            res.clearCookie('session-id');
            res.redirect('/');
        } else {
            const err = new Error('You are not logged in');
            err.status = 401;
            return next(err);
        }
    });

module.exports = userRouter;