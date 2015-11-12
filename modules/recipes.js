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

  return true;
}