/*istanbul ignore next*/
const mongoose = require('./accounts_connect.js');

const accountSchema = new mongoose.Schema({
	_id: { type: String, required: true },
  password: { type: String, required: true }
});

const Account = mongoose.model('accounts', accountSchema);

exports.create = (data, callback) => {
	var account = new Account({ _id: data.username, password: data.password });

	account.save( (err, account) => {
		if (err) {
			return callback('error: '+err);
		};

		callback('added: account '+data.username);
	});
};

exports.login = (data, callback) => {
	Account.find({_id: data.username, password: data.password}, (err, returned) => {
		if (err) {
			return callback('error: '+err);
		};

		if (returned.length === 0) {
			return callback('error: incorrect credentials');
		};

		callback('found: '+data.username);
	});
};

exports.update = (data, callback) => {
	Account.update({_id: data.username, password: data.password}, err => {
		if (err) {
			return callback('error: '+err);
		};

		callback('updated: '+data.username);
	});
};

exports.delete = (data, callback) => {
	Account.remove({_id: data.username, password: data.password}, err => {
		if (err) {
			return callback('error: '+err);
		};

		callback('deleted: '+data.username);
	});
};