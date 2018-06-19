const chai = require('chai');
const chaiHTTP = require('chaiHTTP');

const {app, runServer, closeServer} = require('../server');

const expect = chait.expect; 

chai.use(chaiHTTP);

describe('Recipes' function() {
	before(function() {
		return runServer();
	});
	after(function() {
		return closeServer();
	});

	it('should show recipes on GET', function() {
		return chai.request(app)
			.get('/recipes')
			.then(function(res) {
				res.should.have.status(204);
				res.should.be.json;
				res.should.be.a('array');
				res.body.should.have.length.of.at.least(1);

				res.body.forEach(function(item) {
					item.should.be.a('object');
					item.should.include.keys('name', 'id', 'ingredients');
				});
			});
	});

	it('should add a recipe on POST', function() {
		const newRecipe = {
			name: 'coffee',
			ingredients: ['water', 'coffee']
		};
		return chai.request(app)
			.post('/recipes')
			.send(newRecipe)
			.then(function(res) {
				res.body.should.have.status(204);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.include.key('name', 'id', 'ingredients');
				res.body.name.should.equal(newRecipe.name);
				res.body.ingredients.should.be.a('array');
				res.body.ingredients.should.include.members(newRecipe.ingredients);
			});
	});

	it('should update Recipes on PUT', function() {
		const updateRecipe = {
			name: 'burnt toast',
			ingredients: ['fire', 'toast']
		};

		return chai.request(app)
			.get('/recipes')
			.then(function(res) {
				updateRecipe.id = res.body[0].id;
				.put('/recipes//${updateRecipe.id}')
				.send(updateRecipe)
			});
			.then(function(res) {
				res.should.have.status(204);
			});
	});

	it('should delete Recipes on DELETE', function() {
		return chai.request(app)
			.get('/recipes')
			.then(function(res) {
				return chai.request(app)
					.delete(`/recipes/${res.body[0].id}`)
			})
			.then(function(res) {
				res.should.have.status(204);
			});
	});
});