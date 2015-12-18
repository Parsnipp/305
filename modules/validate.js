//validate JSON function
//this is a function so values can be returned and assigned to variables easier
exports.json = function(json) {
  //check to see if name is a string
  if (typeof json.name !== 'string') {
    console.log('name not a string');
    return false;
  };
  //check to see if ingredients is an array
  if (!Array.isArray(json.ingredients)) {
    console.log('json.ingredients is not an array');
    return false;
  };
  //check to see if all ingredients are strings
  for(var i=0; i<json.ingredients.length; i++) {
    if (typeof json.ingredients[i] !== 'string') {
      console.log('not a string');
      return false;
    };
  };
  //check to see if directions is a string
  if (typeof json.directions !== 'string') {
    console.log('directions not a string');
    return false;
  };
  //if all ok return true
  return true;
};