const db = require('../data/database_handler.js');
const account = require('../users/account_handler.js');

exports.byID = (recipeID, auth, callback) => {
  console.log('delByID');

  if (auth.basic === undefined) {

    callback({code: 401, contentType:'application/json', response:{ status:'error', message:'missing basic auth' }});
  }

  var attempt = {username: auth.basic.username, password: auth.basic.password};

  account.login(attempt, data => {
    console.log(data);
    var response = data.split(':');

    if (response[0] === 'error') {
      return callback({code: 401, contentType:'application/json', response:{ status:'error', message:'invalid credentials' }});
    };
  });

  db.deleteFromDB(recipeID, data => {
    var response = data.split(':');
    if (response[0] === 'error') {

      return callback({code:406, response:{status:'error', contentType:'application/json', message:'recipe not found', data: recipeID}});
    } else {
      
      callback({code:200, response:{status:'success', contentType:'application/json', message:'recipe deleted', data: recipeID}});
    }
  });
}