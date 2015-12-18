//import and XML builder
const builder = require('xmlbuilder');
//declare modules
const db = require('../data/database_handler.js'); //database handler to handle mongodb requests
/* EXPORTED FUNCTIONS */
//get a recipe by ID
exports.byID = (recipeID, callback) => {
  console.log('getByID: '+recipeID);
  //call database get by ID function
  db.getByIdDB(recipeID, data => {
    const response = data.split(':');
    //check if data was successfully retrieved
    if (response[0] === 'error') {
      //if not callback recipe not found
      return callback({code:406, response:{status:'error', contentType:'application/json', message:'recipe not found', data: recipeID}});
    } else {
      //if found remove 'found: ' from start of message
      var json = data.slice(7);
      //callback with found recipe
      callback({code:200, response:{status:'success', contentType:'application/json', message:'recipe found', data: json}});
    };
  });
};
//get all recipes
exports.all = (host, callback) => {
  console.log('getAll');
  //call database get all function
  db.getAllDB(data => {
    const response = data.split(':');
    //check to see if anything was found
    if (response[0] === 'error') {
      //if not found callback nothing found
      return callback({code: 404, contentType:'application/json', response:{ status:'error', message:'no recipes found' }});
    };
    //if found remove 'found: ' from start of message
    var json = data.slice(7);
    //if something was found separate the recipes
    var json = JSON.parse(json);
    var recipe = json.map(function(item) {
      return {id: item._id, name: item.name, ingredients: item.ingredients, link: 'http://'+host+'/recipes/'+item.id};
    });
    //callback with recipes
    callback({code:200, contentType:'application/json', response:{status:'success', message:recipe.length+' recipes found', data: recipe}});
  });
};
//get all recipes as XML
exports.allXML = (host, callback) => {
  console.log('getAllAsXML');
  //declare values for XML builder
  const xml = builder.create('root', {version: '1.0', encoding: 'UTF-8', standalone: true});
  //call database get all function
  db.getAllDB(data => {
    //check if anything was found
    if (data.length === 0) {
      //if nothing found return error message
      xml.ele('message', {status: 'error'}, 'no recipes found');
      xml.end({pretty: true});
      return callback({code: 404, contentType:'application/xml', response: xml});
    } else {
      //if recipes were found create success message
      xml.ele('message', {status: 'success'}, 'recipes found');
      //create XML recipe list
      const xmlRecipes = xml.ele('recipes', {count: data.length});
      //iterate through the recipe list
      for(var i=0; i < data.length; i++) {
        //create a recipe for each item in the list
        var recipe = xmlRecipes.ele('recipe', {id: data[i].id});
        recipe.ele('name', data[i].name);
        recipe.ele('link', {href:'http://'+host+'/recipes/'+data[i].id});
      };
    };
  });
  //end XML
  xml.end({pretty: true});
  //callback success message with XML data
  callback({code: 200, contentType:'application/xml', response: xml});
};