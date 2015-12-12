const builder = require('xmlbuilder');
const sync = require('sync-request');
const db = require('../data/database_handler.js');

const BASEURL = 'http://api.yummly.com/v1/api/recipes?_app_id=f6752399&_app_key=f4805fe510935a98a2bda86abcc28be1&q=';

exports.byID = (recipeID, callback) => {
  console.log('getByID: '+recipeID);

  db.getByIdDB(recipeID, data => {
    const response = data.split(':');
    if (response[0] === 'error') {

      return callback({code:406, response:{status:'error', contentType:'application/json', message:'recipe not found', data: recipeID}});
    } else {

      callback({code:200, response:{status:'success', contentType:'application/json', message:'recipe found', data: response[1]}});
    }
  });
}

exports.byName = (host, name, callback) => {
  console.log('searchByName: '+name);

  var url = BASEURL + name;
  var res = sync('GET', url);
  var returned = JSON.parse(res.getBody().toString('UTF-8'));
  var returned = returned.matches;
  
  for (var i = 0; i < returned.length; i++) {

    var newRecipe = {id: returned[i].id, name:  returned[i].recipeName, ingredients: returned[i].ingredients, directions: returned[i].sourceDisplayName};

    db.postDB(newRecipe, data => {
      const response = data.split(':');

      if (response[0] === 'error') {

        return callback({code: 400, contentType:'application/json', response:{ status:'error', message:'error: ' + response[1] }});
      }
    });
  };

  if (returned.length === 0) {

    callback({code: 404, contentType:'application/json', response:{ status:'error', message:'no recipes found' }});
  }

  var recipe = returned.map(function(item) {

    return {name: item.name, link: 'http://'+host+'/recipes/'+item.id};
  });

  callback({code:200, contentType:'application/json', response:{status:'success', message:returned.length+' recipes found', data: recipe}});
}

exports.all = (host, callback) => {
  console.log('getAll');

  db.getAllDB(data => {
    if (data.length === 0) {

      return callback({code: 404, contentType:'application/json', response:{ status:'error', message:'no recipes found' }});
    }

    var recipe = data.map(function(item) {

      return {name: item.name, link: 'http://'+host+'/recipes/'+item.id};
    });

    callback({code:200, contentType:'application/json', response:{status:'success', message:data.length+' recipes found', data: data}});
  });
}

exports.allXML = (host, callback) => {
  console.log('getAllAsXML');

  var xml = builder.create('root', {version: '1.0', encoding: 'UTF-8', standalone: true});

  db.getAllDB(data => {
    if (data.length === 0) {

      xml.ele('message', {status: 'error'}, 'no recipes found');

    } else {

      xml.ele('message', {status: 'success'}, 'recipes found');

      var xmlRecipes = xml.ele('recipes', {count: data.length});

      for(var i=0; i < data.length; i++) {

        var recipe = xmlRecipes.ele('recipe', {id: data[i].id});

        recipe.ele('name', data[i].name);
        recipe.ele('link', {href:'http://'+host+'/recipes/'+data[i].id});
      }
    }
  });

  xml.end({pretty: true});

  callback({code: 200, contentType:'application/xml', response: xml});
}