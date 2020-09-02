const express = require('express');
const bodyParser = require('body-parser');
const Task = require('../models/task');
const authenticate = require('../authenticate');
const cors = require('./cors');

const taskRouter = express.Router();

taskRouter.use(bodyParser.json());
taskRouter.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
taskRouter.get('/', cors.cors, authenticate.verifyUser, getTasks)
taskRouter.post('/', cors.corsWithOptions, authenticate.verifyUser, postTasks)
taskRouter.put('/', cors.corsWithOptions, authenticate.verifyUser, putTasks)
taskRouter.delete('/', cors.corsWithOptions, authenticate.verifyUser, deleteTasks)
taskRouter.get('/:taskId', cors.cors, authenticate.verifyUser, getTask)
taskRouter.post('/:taskId', cors.corsWithOptions, authenticate.verifyUser, postTask)
taskRouter.put('/:taskId', cors.corsWithOptions, authenticate.verifyUser, putTask)
taskRouter.delete('/:taskId', cors.corsWithOptions, authenticate.verifyUser, deleteTask)

async function getTasks (req, res) {
    try {
        const tasks = await Task.find({ user: req.user._id }).populate('user');
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json('Could not find tasks!');
    }
}

async function postTasks (req, res) {
    try {
        req.body.user = req.user._id;
        const task = await Task.create(req.body);
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json('Could not post tasks!');
    }
}

async function putTasks (req, res) {
    try {
        res.status(403).end(`PUT operation not supported on /tasks`);
    } catch (err) {
        res.status(500).json(`Could not update tasks!`)
    }
}

async function deleteTasks (req, res) {
    try {
        const response = await Task.deleteMany({ user: req.user._id });
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(`Could not delete tasks!`);
    }
}

async function getTask (req, res) {
    try {
        const task = await Task.findById(req.params.taskId);
        if (task.user._id.equals(req.user._id)) {
            res.status(200).json(task);
        } else {
            res.status(403).json('This is not your task!');
        }
    } catch (err) {
        res.status(500).json(`Could not find task!`);
    }
}

async function postTask(req, res) {
    try {
        res.status(403).end(`POST operation not supported on /tasks/${req.params.taskId}`);
    } catch (err) {
        res.status(500).json(`Could not post task!`);
    }
}

async function putTask(req, res) {
    try {
        const task = await Task.findById(req.params.taskId);
        if (task.user._id.equals(req.user._id)) {
            const checked = await Task.findByIdAndUpdate(
                                        req.params.taskId, 
                                        { $set: req.body }, 
                                        { new: true }
                                    );
            res.status(200).json(checked);
        } else {
            res.status(403).json('This is not your task!');
        }
    } catch (err) {
        res.status(500).json(`Could not update task!`);
    }
}

async function deleteTask(req, res) {
    try {
        const task = await Task.findById(req.params.taskId);
        if (task.user._id.equals(req.user._id)) {
            const response = await Task.findByIdAndDelete(req.params.taskId);
            res.status(200).json(response);
        } else {
            res.status(403).end('This is not your task!');
        }
    } catch (err) {
        res.status(500).json(`Could not delete task!`);
    }
}

module.exports = taskRouter; 