const express = require('express');
const bodyParser = require('body-parser');

const taskRouter = express.Router();

taskRouter.use(bodyParser.json());

taskRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all the tasks to you');
})
.post((req, res) => {
    res.end(`Will add the task: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;  //operation not supported
    res.end('PUT operation not supported on /tasks');
})
.delete((req, res) => {
    res.end('Deleting all tasks');
});

module.exports = taskRouter; 