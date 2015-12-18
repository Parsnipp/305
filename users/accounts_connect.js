//removed database connection from main handler for ease of access
//this is separate to normal database handler so accounts can be stared separate to main data
var mongoose = require('./node_modules/mongoose'); //import mongoose
mongoose.connect('mongodb://localhost/accounts'); //connect to mongo database
module.exports = exports = mongoose; //export the connection