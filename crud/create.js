const rand = require('csprng');
const db = require('../data/database_handler.js');
const validate = require('../modules/validate.js');
const account = require('../users/account_handler.js');

exports.new = (auth, body, callback) => {
  console.log('addNew');

  if (auth.basic === undefined) {

    callback({code: 401, contentType:'application/json', response:{ status:'error', message:'missing basic auth' }});
  }

  var attempt = {username: auth.basic.username, password: auth.basic.password};

  account.login(attempt, data => {
    var response = data.split(':');

    if (response[0] === 'error') {
      return callback({code: 401, contentType:'application/json', response:{ status:'error', message:'invalid credentials' }});
    };
  });

  const json = JSON.parse(body);
  const valid = validate.json(json);

  if (valid === false) {

    callback({code: 400, contentType:'application/json', response:{ status:'error', message:'JSON data missing in request body' }});
  }

  const newId = rand(160, 36);
  const newRecipe = {id: newId, name:  json.name, ingredients: json.ingredients, directions: json.directions};

  db.postDB(newRecipe, data => {
    const response = data.split(':');

    if (response[0] === 'added') {

      return callback({code: 201, contentType:'application/json', response:{ status:'success', message:response[1]+' added', data: newRecipe }});
    } else {

      return callback({code: 400, contentType:'application/json', response:{ status:'error', message:'error: ' + response[1] }});
    }
  });
}