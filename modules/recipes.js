var rand = require('csprng');
var builder = require('xmlbuilder');

var recipes = [];

function validateJson(json) {

  if (typeof json.name !== 'string') {
    console.log('name not a string');
    return false;
  }

  if (!Array.isArray(json.ingredients)) {
    console.log('json.ingredients is not an array');
    return false;
  }

  for(var i=0; i<json.ingredients.length; i++) {
    if (typeof json.ingredients[i] !== 'string') {
      console.log('not a string');
      return false;
    }
  }

  if (typeof json.directions !== 'string') {
    console.log('directions not a string');
    return false;
  }

  return true;
}

exports.getByID = function(recipeID) {
  console.log('getByID: '+recipeID);

  for(var i=0; i < recipes.length; i++) {
    if (recipes[i].id === recipeID) {

      return {code:200, response:{status:'success', contentType:'application/json', message:'recipe found', data: recipes[i]}};
    }
  }

  return {code:406, response:{status:'error', contentType:'application/json', message:'recipe not found', data: recipeID}};
}

exports.getByName = function(name) {
  console.log('searchByName: '+name);

  var url = 'http://';
  var res = sync('GET', url);
  var returned = res.getBody();
  var data = [];

  for(var i=0; i < returned.length(); i++) {
    data.push(JSON.parse(returned[i].toString('utf8')));
  }

  return data;
}

exports.getAll = function(host) {
  console.log('getAll');

  if (recipes.length === 0) {

    return {code: 404, contentType:'application/json', response:{ status:'error', message:'no recipes found' }};
  }

  var notes = recipes.map(function(item) {

    return {name: item.name, link: 'http://'+host+'/recipes/'+item.id};
  });

  return {code:200, contentType:'application/json', response:{status:'success', message:recipes.length+' recipes found', data: notes}};
}

exports.getAllXML = function(host) {
  console.log('getAllAsXML');

  var xml = builder.create('root', {version: '1.0', encoding: 'UTF-8', standalone: true});

  if (recipes.length === 0) {

    xml.ele('message', {status: 'error'}, 'no recipes found');

  } else {

    xml.ele('message', {status: 'success'}, 'recipes found');

    var xmlRecipes = xml.ele('recipes', {count: recipes.length});

    for(var i=0; i < recipes.length; i++) {

      var recipe = xmlRecipes.ele('recipe', {id: recipes[i].id});

      recipe.ele('name', recipes[i].name);
      recipe.ele('link', {href:'http://'+host+'/recipes/'+recipes[i].id});
    }
  }

  xml.end({pretty: true});

  return {code: 200, contentType:'application/xml', response: xml};
}

exports.addNew = function(auth, body) {
  console.log('addNew');

  if (auth.basic === undefined) {

    return {code: 401, contentType:'application/json', response:{ status:'error', message:'missing basic auth' }};
  }

  if (auth.basic.username !== 'testuser' || auth.basic.password !== 'p455w0rd') {

    return {code: 401, contentType:'application/json', response:{ status:'error', message:'invalid credentials' }};
  }

  const json = JSON.parse(body);
  const valid = validateJson(json);

  if (valid === false) {

    return {code: 400 ,contentType:'application/json', response:{ status:'error', message:'JSON data missing in request body' }};
  }

  const newId = rand(160, 36);
  const newRecipe = {id: newId, name:  json.name, ingredients: json.ingredients, directions: json.directions};

  recipes.push(newRecipe);

  return {code: 201, contentType:'application/json', response:{ status:'success', message:'new recipe added', data: newRecipe }};
}

exports.delByID = function(recipeID, auth) {
  console.log('delByID');

  if (auth.basic === undefined) {

    return {code: 401, contentType:'application/json', response:{ status:'error', message:'missing basic auth' }};
  }

  if (auth.basic.username !== 'testuser' || auth.basic.password !== 'p455w0rd') {

    return {code: 401, contentType:'application/json', response:{ status:'error', message:'invalid credentials' }};
  }

  for(var i=0; i < recipes.length; i++) {
    if (recipes[i].id === recipeID) {
      recipes.splice(i, 1);
      if (recipes.length == 0) {
        return {code:200, response:{status:'success', contentType:'application/json', message:'recipe deleted'}};
      } else if (recipes[i].id != recipeID) {
        return {code:200, response:{status:'success', contentType:'application/json', message:'recipe deleted'}};
      } else {
        return {code: 401, contentType:'application/json', response:{ status:'error', message:'failed to delete' }};
      }
    }
  }  
}

exports.update = function(recipeID, body, auth) {
  console.log('update');

  if (auth.basic === undefined) {

    return {code: 401, contentType:'application/json', response:{ status:'error', message:'missing basic auth' }};
  }

  if (auth.basic.username !== 'testuser' || auth.basic.password !== 'p455w0rd') {

    return {code: 401, contentType:'application/json', response:{ status:'error', message:'invalid credentials' }};
  }

  const json = JSON.parse(body);
  const valid = validateJson(json);

  if (valid === false) {

    return {code: 400 ,contentType:'application/json', response:{ status:'error', message:'JSON data missing in request body' }};
  }

  const newRecipe = {id: recipeID, name:  json.name, recipe: json.recipe};

  for(var i=0; i < recipes.length; i++) {
    if (recipes[i].id === recipeID) {
      recipes.splice(i, 1);
      recipes.push(newRecipe);
      return {code: 201, contentType:'application/json', response:{ status:'success', message:'new recipe added', data: newRecipe }};
    }
  }

  return {code: 400 ,contentType:'application/json', response:{ status:'error', message:'JSON data missing in request body' }};
}