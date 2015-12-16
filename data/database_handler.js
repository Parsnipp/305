/*istanbul ignore next*/
var mongoose = require('./recipes_connect.js');
var database = 'recipes';

const recipeSchema = new mongoose.Schema({
	_id: { type: String, required: true },
  name: { type: String },
  ingredients: [ { type: String } ],
  directions: { type: String }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

exports.getAllDB = callback => {
	Recipe.find( (err, data) => {
    if (err) {
      console.log('error');
      return callback('error: '+err);
    };

    callback(data);
  });
};

exports.getByIdDB = (id, callback) => {
	Recipe.find({_id: id}, (err, data) => {
    if (err) {

      return callback('error: '+err);
    };

    const recipe = data.map( item => {

      return {_id: item.id, name: item.name, ingredients: item.ingredients, directions: item.directions};
    });

    callback('found: '+JSON.stringify(recipe));
  });
};

exports.getByNameDB = (name, callback) => {
	Recipe.find({name: name}, (err, data) => {
    if (err) {

      return callback('error: '+err);
    };

    callback('found: '+data);
  });
};

exports.postDB = (data, callback) => {
  var ingredients = data.ingredients.toString().split(',').map(function(item) {

    return item.trim();
  });
  
  var newRecipe = new Recipe({ _id: data._id, name: data.name, ingredients: ingredients, directions: data.directions });

	newRecipe.save( (err, newRecipe) => {
    if (err) {

      return callback('error: '+err);
    };
    
    callback('added: '+data.name);
  });
};

exports.putDB = (data, callback) => {
  Recipe.update({_id: data.id}, {_id: data.id, name: data.name, ingredients: data.ingredients, directions: data.directions}, (err, data) => {
    if (err) {

      return callback('error: '+err);
    };

    callback('added: '+data);
  });
};

exports.deleteFromDB = (data, callback) => {
	console.log('deleteID: '+data);

	Recipe.remove({_id: data}, (err, result) => {
    if (err) {

      return callback('error: '+err);
    }

    callback('recipe: deleted');
  })
};