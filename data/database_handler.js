/*istanbul ignore next*/
var mongoose = require('mongoose');
var database = 'recipes';

const server = 'mongodb://localhost/'+database;

console.log(server);
mongoose.connect(server);
const db = mongoose.connection;

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

    callback('found: '+recipe);
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
	const id = data.id;
  const name = data.name;
  const ing = data.ingredients;
  const ingredients = ing.toString().split(',').map(function(item) {

    return item.trim();
  });

  const directions = data.directions;
  
  const newRecipe = new Recipe({ _id: id, name: name, ingredients: ingredients, directions: directions });

	newRecipe.save( (err, newRecipe) => {
    if (err) {

      return callback('error: '+err);
    };

    callback('added: '+data.name);
  });
};

exports.putDB = (data, callback) => {
	Recipe.remove({_id: data.id}, err => {
    if (err) {

      return callback('error: '+err);
    };

		const id = data.id;
	  const name = data.name;
	  const ing = data.ingredients;
	  const ingredients = ing.toString().split(',').map(function(item) {

	    return item.trim();
	  });

	  const directions = data.directions;
	  
	  const newRecipe = new Recipe({ _id: id, name: name, ingredients: ingredients, directions: directions });

	  newRecipe.save( (err, data) => {
	    if (err) {

	      return callback('error: '+err);
	    };

	    callback('added: '+data);
	  });
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