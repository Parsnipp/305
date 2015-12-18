//setup database
var mongoose = require('./recipes_connect.js'); //declare database connection module
//create a schema for the database
const recipeSchema = new mongoose.Schema({
	_id: { type: String, required: true },
  name: { type: String },
  ingredients: [ { type: String } ],
  directions: { type: String }
});
//declare mongo collection and schema in mongoose model
const Recipe = mongoose.model('Recipe', recipeSchema);
//database get all function
exports.getAllDB = callback => {
  //find from database
	Recipe.find( (err, data) => {
    //check for errors
    if (err) {
      //if error callback error message
      return callback('error: '+err);
    };
    //if not then callback data
    callback('found: '+JSON.stringify(data));
  });
};
//database get by id function
exports.getByIdDB = (id, callback) => {
  //find from database by ID
	Recipe.find({_id: id}, (err, data) => {
    //check for errors
    if (err) {
      //if error callback error message
      return callback('error: '+err);
    };
    //if not map recipe
    const recipe = data.map( item => {
      //format of mapped recipe
      return {_id: item.id, name: item.name, ingredients: item.ingredients, directions: item.directions};
    });
    //callback found and string version of mapped recipe
    callback('found: '+JSON.stringify(recipe));
  });
};
//database post function
exports.postDB = (data, callback) => {
  //turn ingredients into a saveable format
  const ingredients = data.ingredients.toString().split(',').map(function(item) {
    return item.trim();
  });
  //create a the new recipe
  const newRecipe = new Recipe({ _id: data._id, name: data.name, ingredients: ingredients, directions: data.directions });
  //save to the database
	newRecipe.save( (err, newRecipe) => {
    //check for errors
    if (err) {
      //if error found callback error message
      return callback('error: '+err);
    };
    //if not callback success
    callback('added: '+data.name);
  });
};
//database put function
exports.putDB = (data, callback) => {
  //update the recipe from the database
  Recipe.update({_id: data.id}, {_id: data.id, name: data.name, ingredients: data.ingredients, directions: data.directions}, (err, data) => {
    //check for errors
    if (err) {
      //if found callback error message
      return callback('error: '+err);
    };
    //if not callback success
    callback('updated: '+data);
  });
};
//database delete function
exports.deleteFromDB = (data, callback) => {
  //delete the recipe from the database
	Recipe.remove({_id: data}, (err, result) => {
    //check for errors
    if (err) {
      //if found callback error message
      return callback('error: '+err);
    };
    //if not callback success
    callback('recipe: deleted');
  });
};