const builder = require('xmlbuilder');
const db = require('../data/database_handler.js');

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