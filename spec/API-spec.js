/*istanbul ignore next*/

const recipe = require('../modules/recipes.js');

describe('Recipes', function() {
	it('should add an recipe to the "database"', function(){
		var auth = {basic : {username: 'testuser', password: 'p455w0rd'}};
		var recipeAdd = '{"name": "curry", "ingredients": ["chicken", "pasata", "curry paste", "rice"], "directions": "Cook chicken, add curry paste and pasata while cooking rice."}';
		var expectation = recipe.addNew(auth, recipeAdd);
		expect(expectation.code).toEqual(201);
	});

	it('should get all items', function() {
		var expectation = recipe.getAll('localhost:8080');
		expect(expectation.response.data.length).toEqual(1);
	});

	it('should get all recipes in XML', function() {
		var expectation = recipe.getAllXML('localhost:8080');
		expect(expectation.code).toEqual(200);
	});

	it('should update the recipe in the list', function() {
		var auth = {basic : {username: 'testuser', password: 'p455w0rd'}};
		var items = recipe.getAll('localhost:8080');
		var itemLink = items.response.data[0].link;
		var itemID = itemLink.split('/');
		var body = '{"name": "chilli", "ingredients": ["mince", "pasata", "chilli powder", "rice"], "directions": "Cook mince, add pasata and powder, simmer while cooking rice."}';
		var expectation = recipe.update(itemID[4], body, auth);
		expect(expectation.code).toEqual(201);
	});

	it("should get an recipe by it's ID", function() {
		var items = recipe.getAll('localhost:8080');
		var itemLink = items.response.data[0].link;
		var itemID = itemLink.split('/');
		var expectation = recipe.getByID(itemID[4]);
		expect(expectation.code).toEqual(200);
	});

	it('should delete the recipe', function() {
		var auth = {basic : {username: 'testuser', password: 'p455w0rd'}};
		var items = recipe.getAll('localhost:8080');
		var itemLink = items.response.data[0].link;
		var itemID = itemLink.split('/');
		var expectation = recipe.delByID(itemID[4], auth);
		expect(expectation.code).toEqual(200);
	});
});