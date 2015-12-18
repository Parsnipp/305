//removed database connection from main handler for ease of access
const mongoose = require('mongoose'); //import mongoose
mongoose.connect('mongodb://localhost/recipes'); //connect to mongo database
module.exports = exports = mongoose; //export the connection