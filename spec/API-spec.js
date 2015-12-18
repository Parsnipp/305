/*istanbul ignore next*/
const remote = require('../modules/remote.js');
const create = require('../crud/create.js');
const read = require('../crud/read.js');
const update = require('../crud/update.js');
const destroy = require('../crud/destroy.js');
const account = require('../users/account_handler.js');

describe('Recipes', done => {
	it('should create a user account', done => {
		const user = {username: 'testuser2', password: 'p455w0rd'};
		account.create(user, expectation => {
			expect(expectation).toBe('added: account testuser2');
			done();
		});
	});


	it('should update the user account', done => {
		const user = {username: 'testuser2', password: 'password'};
		account.update(user, expectation => {
			expect(expectation).toBe('updated: testuser2');
			done();
		});
	});

	it('should delete the user account', done => {
		const user = {username: 'testuser2', password: 'password'};
		account.delete(user, expectation => {
			expect(expectation).toBe('deleted: testuser2');
			done();
		});
	});

	it('should add a recipe to the "database"', done => {
		const auth = {basic : {username: 'testuser', password: 'password'}};
		const recipeAdd = '{"name": "curry", "ingredients": ["chicken", "pasata", "curry paste", "rice"], "directions": "Cook chicken, add curry paste and pasata while cooking rice."}';
		create.new(auth, recipeAdd, expectation => {
			expect(expectation.code).toEqual(201);
			done();
		});
	});

	it('should get all items', done => {
		read.all('localhost:8080', expectation => {
			expect(expectation.code).toEqual(200);
			done();
		});
	});

	it('should get all recipes in XML', done => {
		read.allXML('localhost:8080', expectation => {
			expect(expectation.code).toEqual(200);
			done();
		});
	});

	it('should update the recipe in the list', done => {
		const auth = {basic : {username: 'testuser', password: 'password'}};
		read.all('localhost:8080', items => {
			console.log(items.response.data[0].id);
			const itemID = items.response.data[0].id;
			const body = '{"name": "chilli", "ingredients": ["mince", "pasata", "chilli powder", "rice"], "directions": "Cook mince, add pasata and powder, simmer while cooking rice."}';
			update.item(itemID, body, auth, expectation => {
				expect(expectation.code).toEqual(201);
				done();
			});
		});
	});

	it("should get a recipe by it's ID", done => {
		read.all('localhost:8080', items => {
			const itemID = items.response.data[0].id;
			read.byID(itemID, expectation => {
				expect(expectation.code).toEqual(200);
				done();
			});
		});
	});

	it('should delete the recipe', done => {
		const auth = {basic : {username: 'testuser', password: 'password'}};
		read.all('localhost:8080', items => {
			const itemID = items.response.data[0]._id;
			destroy.byID(itemID, auth, expectation => {
				expect(expectation.code).toEqual(200);
				done();
			});
		});
	});

	it('should get recipes from third party API', done => {
		remote.search('localhost:8080', 'pasta', expectation => {
			expect(expectation.code).toEqual(200);
			done();
		});
	});

	it('should get a single recipe from third party API', done => {
		remote.single('localhost:8080', 'Pasta-Alfredo-1400011', expectation => {
			expect(expectation.code).toEqual(200);
			done();
		});
	});
});