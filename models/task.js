const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create a schema
const taskSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    type: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    duedate: {
        type: Number,  //change to Date type
        required: true
    }
}, {
    timestamps: true
});

// Create a model using the schema
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;