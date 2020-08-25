const express = require('express');
const bodyParser = require('body-parser');
const Task = require('../models/task');

const taskRouter = express.Router();

taskRouter.use(bodyParser.json());

taskRouter
    .route('/')
    .get((req, res, next) => {
        Task.find()   //returns promise
            .then(tasks => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(tasks);
            })
            .catch(err => next(err));   //pass err off to the overall error handler for this express application
    })
    .post((req, res, next) => {
        Task.create(req.body)   //returns promise (mongoose checks if data fits schema)
            .then(task => {
                console.log('Task Created: ', task);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(task);
            })
            .catch(err => next(err));
    })
    .put((req, res) => {
        res.statusCode = 403;  //operation not supported
        res.end('PUT operation not supported on /tasks');
    })
    .delete((req, res, next) => {
        Task.deleteMany()
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch(err => next(err));
    });

taskRouter
    .route('/:taskId')
    .get((req, res, next) => {
        Task.findById(req.params.taskId)
            .then(task => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(task);
            })
            .catch(err => next(err));
    })
    .post((req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /tasks/${req.params.taskId}`);
    })
    .put((req, res, next) => {
        Task.findByIdAndUpdate(req.params.taskId, {
            $set: req.body
        }, { new: true })
            .then(task => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(task);
            })
            .catch(err => next(err));
    })
    .delete((req, res, next) => {
        Task.findByIdAndDelete(req.params.taskId)
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch(err => next(err));
    });

module.exports = taskRouter; 