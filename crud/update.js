//declare modules
const db = require('../data/database_handler.js'); //database handler to handle mongodb requests
const validate = require('../modules/validate.js'); //JSON validator to make sure recipes are valid
const account = require('../users/account_handler.js'); //user account handler for account verification
/* EXPORTED FUNCTIONS */
//update item function
exports.item = (recipeID, body, auth, callback) => {
  console.log('update');
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
  });
  //parse and validate the JSON data
  const json = JSON.parse(body);
  const valid = validate.json(json);
  //check if JSON data is valid
  if (valid === false) {
    //if not valid callback invalid JSON data
    callback({code: 400 ,contentType:'application/json', response:{ status:'error', message:'JSON data missing in request body' }});
  };
  //create a new recipe JSON
  var newRecipe = {id: recipeID, name: json.name, ingredients: json.ingredients, directions: json.directions};
  //call database update function
  db.putDB(newRecipe, data => {
    const response = data.split(':');
    //check if recipe was successfully updated
    if (response[0] === 'updated') {
      //if successfully updated callback success message
      return callback({code: 201, contentType:'application/json', response:{ status:'success', message:response[1]+' updated', data: newRecipe }});
    } else {
      //if not callback error message
      callback({code: 400, contentType:'application/json', response:{ status:'error', message:'error: ' + response[1] }});
    };
  });
};