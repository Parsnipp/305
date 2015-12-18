//import mongo connection
const mongoose = require('./accounts_connect.js');
//create scheme for user accounts
const accountSchema = new mongoose.Schema({
	_id: { type: String, required: true },
  password: { type: String, required: true }
});
//declare collection and scheme to database
const Account = mongoose.model('accounts', accountSchema);
//account create function
exports.create = (data, callback) => {
	//format data to fit schema
	var account = new Account({ _id: data.username, password: data.password });
	//database save function
	account.save( (err, account) => {
		//check for errors
		if (err) {
			//if found return error message
			return callback('error: '+err);
		};
		//if not callback success
		callback('added: account '+data.username);
	});
};
//login function
exports.login = (data, callback) => {
	//database find account function
	Account.find({_id: data.username, password: data.password}, (err, returned) => {
		//check for errors
		if (err) {
			//if found callback error message
			return callback('error: '+err);
		};
		//if not check if whats returned is longer than 0
		if (returned.length === 0) {
			//if not return error incorrect credentials
			return callback('error: incorrect credentials');
		};
		//if both ok return success
		callback('found: '+data.username);
	});
};
//update account function
exports.update = (data, callback) => {
	//database update function
	Account.update({_id: data.username}, {password: data.password}, { upsert: true }, err => {
		//check for errors
		if (err) {
			//if found return error message
			return callback('error: '+err);
		};
		//if not return success
		callback('updated: '+data.username);
	});
};
//delete account function
exports.delete = (data, callback) => {
	//database delete function
	Account.remove({_id: data.username, password: data.password}, err => {
		//check for errors 
		if (err) {
			//if found callback error message
			return callback('error: '+err);
		};
		//if not callback success
		callback('deleted: '+data.username);
	});
};