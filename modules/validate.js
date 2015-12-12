exports.json(json) {

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