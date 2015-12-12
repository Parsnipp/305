/*istanbul ignore next*/

const recipe = require('../modules/recipes.js');

describe('Recipes', function(done) {
	it('should add a recipe to the "database"', function(done){
		var auth = {basic : {username: 'testuser', password: 'p455w0rd'}};
		var recipeAdd = '{"name": "curry", "ingredients": ["chicken", "pasata", "curry paste", "rice"], "directions": "Cook chicken, add curry paste and pasata while cooking rice."}';
		recipe.addNew(auth, recipeAdd, expectation => {
			expect(expectation.code).toEqual(201);
			done();
		});
	});

	it('should get all items', function(done) {
		recipe.getAll('localhost:8080', expectation => {
			expect(expectation.code).toEqual(200);
			done();
		});
	});

	it('should get all recipes in XML', function(done) {
		recipe.getAllXML('localhost:8080', expectation => {
			expect(expectation.code).toEqual(200);
			done();
		});
	});

	it('should update the recipe in the list', function(done) {
		var auth = {basic : {username: 'testuser', password: 'p455w0rd'}};
		recipe.getAll('localhost:8080', items => {
			var itemID = items.response.data[0]._id;
			var body = '{"name": "chilli", "ingredients": ["mince", "pasata", "chilli powder", "rice"], "directions": "Cook mince, add pasata and powder, simmer while cooking rice."}';
			recipe.update(itemID, body, auth, expectation => {
				expect(expectation.code).toEqual(201);
				done();
			});
		});
	});

	it("should get an recipe by it's ID", function(done) {
		recipe.getAll('localhost:8080', items => {
			var itemID = items.response.data[0]._id;
			recipe.getByID(itemID, expectation => {
				expect(expectation.code).toEqual(200);
				done();
			});
		});
	});

	it('should delete the recipe', function(done) {
		console.log('delete test');
		var itemID;
		var auth = {basic : {username: 'testuser', password: 'p455w0rd'}};
		recipe.getAll('localhost:8080', items => {
			var itemID = items.response.data[0]._id;
			recipe.delByID(itemID, auth, expectation => {
				expect(expectation.code).toEqual(200);
				done();
			});
		});
	});

	// it('should get recipes from third party API', function(done) {
	// 	recipe.getByName('localhost:8080', 'pasta', expectation => {
	// 		expect(expectation.code).toEqual(200);
	// 		done();
	// 	});
	// });
});