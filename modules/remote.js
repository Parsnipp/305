const sync = require('sync-request');
const db = require('../data/database_handler.js');

const BASEURL = 'http://api.yummly.com/v1/api/';
const IDANDKEY = '?_app_id=f6752399&_app_key=f4805fe510935a98a2bda86abcc28be1&q=';
const SEARCH = 'recipes';
const DIRECT = 'recipe/';

exports.search = (host, name, callback) => {
  console.log('searchByName: '+name);

  var url = BASEURL + SEARCH + IDANDKEY + name;
  var res = sync('GET', url);
  var returned = JSON.parse(res.getBody().toString('UTF-8'));
  var returned = returned.matches;

  if (returned.length === 0) {

    callback({code: 404, contentType:'application/json', response:{ status:'error', message:'no recipes found' }});
  };

  var recipe = returned.map(function(item) {

    return {id: item.id, name: item.recipeName, ingredients: item.ingredients, link: 'http://'+host+'/recipes/remote/'+item.id};
  });

  callback({code:200, contentType:'application/json', response:{status:'success', message:returned.length+' recipes found', data: recipe}});
};

exports.single = (host, id, callback) => {
  console.log('getFrom3rd');

  var url = BASEURL + DIRECT + id + IDANDKEY;
  var res = sync('GET', url);
  var returned = JSON.parse(res.getBody().toString('UTF-8'));

  if (returned.length === 0) {
    callback({code: 404, contentType:'application/json', response:{ status:'error', message:'no recipes found' }});
  };

  const newRecipe = {_id: returned.id, name: returned.name, ingredients: returned.ingredientLines, directions: 'Can be found at: '+returned.source.sourceRecipeUrl};

  db.postDB(newRecipe, data => {
    const response = data.split(':');
      if (response[0] === 'error') {

        return callback({code: 400, contentType:'application/json', response:{ status:'error', message:'error: ' + response[1] }});
      }
  });

  callback({code:200, contentType:'application/json', response:{status:'success', data: newRecipe}});
};