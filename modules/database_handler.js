/*istanbul ignore next*/
var mongoose = require('mongoose');
var database = 'recipes';

const server = 'mongodb://localhost'+'/'+database;

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

// exports.getAllDB = callback => {
// 	Recipe.find( (err, data) => {

//     if (err) {

//       callback('error: '+err);
//     };

//     const recipe = data.map( item => {

//       return {id: item.id, name: item.name};
//     });

//     callback(recipe);
//   });
// };

// exports.getByIdDB = (id, callback) => {
// 	Recipe.find({id: id}, (err, data) => {
//     if (err) {

//       callback('error: '+err);
//     };

//     callback(data);
//   });
// };

// exports.getByNameDB = (name, callback) => {
// 	Recipe.find({name: name}, (err, data) => {
//     if (err) {

//       callback('error: '+err);
//     };

//     callback(data);
//   });
// };

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

    	// return "he's dead Jim";
      callback('error: '+err);
    };

    // return 'added: '+data.name;
    callback('added: '+data);
  });

  return data;
};

// exports.putDB = (data, callback) => {
// 	Recipe.remove({id: id}, err => {
//     if (err) {

//       callback('error: '+err);
//     };

// 		const step1 = data.split(':');

// 	  const name = step1[0];
// 	  const items = step1[1].split(',').map(function(item) {

// 	    return item.trim();
// 	  });
	  
// 	  const newRecipe = new Recipe({ id: id, name: name, ingredients: ingredients, directions: directions });

// 	  newRecipe.save( (err, data) => {
// 	    if (err) {

// 	      callback('error: '+err);
// 	    };

// 	    callback('added: '+data);
// 	  });
// 	});
// };

exports.deleteFromDB = (data, callback) => {
	Recipe.remove({_id: id}, err => {
    if (err) {

      callback('error: '+err);
    };

    callback('recipe deleted');
  });
};