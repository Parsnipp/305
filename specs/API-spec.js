/*istanbul ignore next*/

var recipe = require('../modules/recipes.js');

describe('Recipes', function() {
	it('should add an recipe to the "database"', function(){
		var auth = {basic : {username: 'testuser', password: 'p455w0rd'}};
		recipe = {name: 'curry', ingredients: ['chicken', 'pasata', 'curry paste', 'rice'], directions: 'Cook chicken, add curry paste and pasata while cooking rice'};
		var expectation = recipe.addNew(auth, recipe);
		expect(expectation.code).toEqual(200);
	});

	it('should get all items', function(){
		var expectation = recipe.getAll('localhost:8080');
		expect(expectation.response.data.length).toEqual(1);
	});
});