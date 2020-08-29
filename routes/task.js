const express = require('express');
const bodyParser = require('body-parser');
const Task = require('../models/task');
const authenticate = require('../authenticate');
const { db } = require('../models/task');

const taskRouter = express.Router();

taskRouter.use(bodyParser.json());

taskRouter
    .route('/')
    .get(authenticate.verifyUser, (req, res, next) => {
        Task.find({ user: req.user._id })
            .populate('user')
                .then(tasks => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(tasks);
                })
                .catch(err => next(err));   //pass err off to the overall error handler for this express application
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        req.body.user = req.user._id;
        Task.create(req.body)   //returns promise (mongoose checks if data fits schema)
            .then(task => {
                console.log('Task Created: ', task);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(task);
            })
            .catch(err => next(err));
    })
    .put(authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;  //operation not supported
        res.end('PUT operation not supported on /tasks');
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Task.deleteMany({ user: req.user._id })
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch(err => next(err));
    });

taskRouter
    .route('/:taskId')
    .get(authenticate.verifyUser, (req, res, next) => {
        Task.findById(req.params.taskId)
            .then(task => {
                if (task) {
                    if (task.user._id.equals(req.user._id)) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(task);
                    } else {
                        res.statusCode = 403;
                        res.end('This is not your task!');
                    }
                } else {
                    res.statusCode = 403;
                    res.end('Task does not exist!');
                }
            })
            .catch(err => next(err));
    })
    .post(authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /tasks/${req.params.taskId}`);
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Task.findById(req.params.taskId)
            .then(task => {
                if (task) {
                    if (task.user._id.equals(req.user._id)) {
                        Task.findByIdAndUpdate(
                            req.params.taskId, 
                            { $set: req.body }, 
                            { new: true }
                        )
                            .then(task => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(task);
                            })
                            .catch(err => next(err));
                    } else {
                        res.statusCode = 403;
                        res.end('This is not your task!');
                    }
                } else {
                    res.statusCode = 403;
                    res.end('Task does not exist!');
                }
            })
            .catch(err => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Task.findById(req.params.taskId)
            .then(task => {
                if (task) {
                    if (task.user._id.equals(req.user._id)) {
                        Task.findByIdAndDelete(req.params.taskId)
                            .then(response => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(response);
                            })
                            .catch(err => next(err));
                    } else {
                        res.statusCode = 403;
                        res.end('This is not your task!');
                    }
                } else {
                    res.statusCode = 403;
                    res.end('Task does not exist!');
                }
            })
            .catch(err => next(err));
    });

module.exports = taskRouter; 