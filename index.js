
var restify = require('restify');
var server = restify.createServer();

server.use(restify.fullResponse());
server.use(restify.bodyParser());
server.use(restify.authorizationParser());

var recipes = require('./modules/recipes');

server.get('/', function(req, res, next) {
  res.redirect('/recipes', next);
});

server.get('/modules/recipes', function(req, res) {

});

server.get('/modules/recipes:recipeID', function(req, res) {

});

server.post('/modules/recipes:recipeID', function(req, res) {

});

server.put('/modules/recipes:recipeID', function(req, res) {

});

server.del('/modules/recipes:recipeID', function(req, res) {

});