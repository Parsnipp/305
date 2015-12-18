//import random number generator for IDs
const rand = require('csprng');
//declare modules
const db = require('../data/database_handler.js'); //database handler to handle mongodb requests
const validate = require('../modules/validate.js'); //JSON validator to make sure recipes are valid
const account = require('../users/account_handler.js'); //user account handler for account verification

/* EXPORTED FUNCTIONS */
//create new recipe function
exports.new = (auth, body, callback) => {
  console.log('addNew');
  //check if authentication sent
  if (auth.basic === undefined) {
    //if no authentication callback missing authentication
    callback({code: 401, contentType:'application/json', response:{ status:'error', message:'missing basic auth' }});
  };
  //create authentication variable
  var attempt = {username: auth.basic.username, password: auth.basic.password};
  //attempt to log in using declared authentication
  account.login(attempt, data => {
    var response = data.split(':');
    //if authentication failed callback invalid credentials
    if (response[0] === 'error') {
      return callback({code: 401, contentType:'application/json', response:{ status:'error', message:'invalid credentials' }});
    };
  });
  //parse and validate JSON data
  const json = JSON.parse(body);
  const valid = validate.json(json);
  //check is data is valid
  if (valid === false) {
    //if JSON data is invalid callback bits of data missing
    callback({code: 400, contentType:'application/json', response:{ status:'error', message:'JSON data missing in request body' }});
  };
  //create a random number to be used as the ID
  const newId = rand(160, 36);
  //create a new recipe JSON
  const newRecipe = {_id: newId, name:  json.name, ingredients: json.ingredients, directions: json.directions};
  //call the database post function
  db.postDB(newRecipe, data => {
    const response = data.split(':');
    //check if recipe was successfully added
    if (response[0] === 'added') {
      //if successful callback success
      return callback({code: 201, contentType:'application/json', response:{ status:'success', message:response[1]+' added', data: newRecipe }});
    } else {
      //if failed callback error and error message
      return callback({code: 400, contentType:'application/json', response:{ status:'error', message:'error: ' + response[1] }});
    };
  });
};