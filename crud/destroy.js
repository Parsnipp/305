//declare modules
const db = require('../data/database_handler.js'); //database handler to handle mongodb requests
const account = require('../users/account_handler.js'); //user account handler for account verification
/* EXPORTED FUNCTIONS */
//delete item function
exports.byID = (recipeID, auth, callback) => {
  console.log('delByID');
  //check if any authentication is sent
  if (auth.basic === undefined) {
    //if no authentication callback missing auth
    callback({code: 401, contentType:'application/json', response:{ status:'error', message:'missing basic auth' }});
  };
  //create authentication variable
  var attempt = {username: auth.basic.username, password: auth.basic.password};
  //verify authentication
    account.login(attempt, data => {
    var response = data.split(':');
    //check if authentication is valid
    if (response[0] === 'error') {
      //if not valid callback invalid credentials
      return callback({code: 401, contentType:'application/json', response:{ status:'error', message:'invalid credentials' }});
    };
  })
  //database delete function
  db.deleteFromDB(recipeID, data => {
    var response = data.split(':');
    //check to see if successfully deleted
    if (response[0] === 'error') {
      //if not callback recipe not found
      return callback({code:406, response:{status:'error', contentType:'application/json', message:'recipe not found', data: recipeID}});
    } else {
      //if so callback success
      callback({code:200, response:{status:'success', contentType:'application/json', message:'recipe deleted', data: recipeID}});
    };
  });
};