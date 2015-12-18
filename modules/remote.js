//import sync request to access external APIs
const sync = require('sync-request');
//declare modules
const db = require('../data/database_handler.js'); //database handler to handle mongodb requests
//declare URL parameters
const BASEURL = 'http://api.yummly.com/v1/api/';
const IDANDKEY = '?_app_id=f6752399&_app_key=f4805fe510935a98a2bda86abcc28be1&q=';
const SEARCH = 'recipes';
const DIRECT = 'recipe/';
//3rd party search function
exports.search = (host, name, callback) => {
  console.log('searchByName: '+name);
  //assemble URL
  var url = BASEURL + SEARCH + IDANDKEY + name;
  //send GET request
  var res = sync('GET', url);
  //create a list of returned recipes
  var returned = JSON.parse(res.getBody().toString('UTF-8'));
  var returned = returned.matches;
  //check to see if any were found
  if (returned.length === 0) {
    //if not callback not found error
    callback({code: 404, contentType:'application/json', response:{ status:'error', message:'no recipes found' }});
  };
  //if found map found recipes
  var recipe = returned.map(function(item) {
    //template for mapping
    return {id: item.id, name: item.recipeName, ingredients: item.ingredients, link: 'http://'+host+'/recipes/remote/'+item.id};
  });
  //callback success and found recipes
  callback({code:200, contentType:'application/json', response:{status:'success', message:returned.length+' recipes found', data: recipe}});
};
//3rd party get item by ID function
exports.single = (host, id, callback) => {
  console.log('getFrom3rd');
  //assemble URL
  var url = BASEURL + DIRECT + id + IDANDKEY;
  //perform get request
  var res = sync('GET', url);
  //parse returned data
  var returned = JSON.parse(res.getBody().toString('UTF-8'));
  //check to see if anything was returned
  if (returned.length === 0) {
    //if nothing was returned callback not found error
    callback({code: 404, contentType:'application/json', response:{ status:'error', message:'no recipes found' }});
  };
  //if found create a recipe to be saved to the database
  const newRecipe = {_id: returned.id, name: returned.name, ingredients: returned.ingredientLines, directions: 'Can be found at: '+returned.source.sourceRecipeUrl};
  //call database create function
  db.postDB(newRecipe, data => {
    const response = data.split(':');
    //check for errors
    if (response[0] === 'error') {
      //if error found callback error message
      return callback({code: 400, contentType:'application/json', response:{ status:'error', message:'error: ' + response[1] }});
    };
  });
  //if not callback success
  callback({code:200, contentType:'application/json', response:{status:'success', data: newRecipe}});
};