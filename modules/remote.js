const sync = require('sync-request');
const db = require('../data/database_handler.js');

const BASEURL = 'http://api.yummly.com/v1/api/';
const IDANDKEY = '?_app_id=f6752399&_app_key=f4805fe510935a98a2bda86abcc28be1&q=';
const SEARCH = 'recipes';
const DIRECT = 'recipe/recipe-id';

exports.search = (host, name, callback) => {
  console.log('searchByName: '+name);

  var url = BASEURL + SEARCH + IDANDKEY + name;
  var res = sync('GET', url);
  var returned = JSON.parse(res.getBody().toString('UTF-8'));
  var returned = returned.matches;
  
  // for (var i = 0; i < returned.length; i++) {

  //   var newRecipe = {id: returned[i].id, name:  returned[i].recipeName, ingredients: returned[i].ingredients, directions: returned[i].sourceDisplayName};

  //   db.postDB(newRecipe, data => {
  //     const response = data.split(':');

  //     if (response[0] === 'error') {

  //       return callback({code: 400, contentType:'application/json', response:{ status:'error', message:'error: ' + response[1] }});
  //     }
  //   });
  // };

  if (returned.length === 0) {

    callback({code: 404, contentType:'application/json', response:{ status:'error', message:'no recipes found' }});
  }

  var recipe = returned.map(function(item) {

    return {name: item.name, link: 'http://'+host+'/recipes/remote/'+item.id};
  });

  callback({code:200, contentType:'application/json', response:{status:'success', message:returned.length+' recipes found', data: recipe}});
}

exports.single = (host, name, callback) => {
  /*  log function
      assemble url
      sync
      parse
      return if length 0
      save to database
      callback recipe */
}