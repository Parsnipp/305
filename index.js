
var restify = require('restify');
var server = restify.createServer();

server.use(restify.fullResponse());
server.use(restify.bodyParser());
server.use(restify.authorizationParser());

var recipes = require('./modules/recipes.js');

server.get('/', function(req, res, next) {
  res.redirect('/recipes', next);
});

server.get('/recipes/remote/:name', function(req, res) {
	console.log('getting recipes by name');

	const name = req.params.name;
	const data = recipes.getByName(name);

	res.setHeader('content-type', 'application/json');
  res.send(data.code, data.response);
  res.end();
});

server.get('/recipes', function(req, res) {
  console.log('getting a list of all recipes');

  const host = req.headers.host;
  console.log(host);

  var data, type;

  if (req.header('Accept') === 'application/xml') {
    data = recipes.getAllXML(host);
  } else {
    data = recipes.getAll(host);
  }

  res.setHeader('content-type', data.contentType);
  res.send(data.code, data.response);
  res.end();
});

server.get('/recipes/:recipeID', function(req, res) {
  console.log("getting a recipe based on it's ID");

  const recipeID = req.params.recipeID;
  const data = recipes.getByID(recipeID);

  res.setHeader('content-type', 'application/json');
  res.send(data.code, data.response);
  res.end();
});

server.post('/recipes', function(req, res) {
  console.log('adding recipe to saved recipes');

  const body = req.body;
  const auth = req.authorization;

  console.log(auth);
  const data = recipes.addNew(auth, body);
  res.setHeader('content-type', data.contentType);
  res.send(data.code, data.response);
  res.end();
});

server.put('/recipes/:recipeID', function(req, res) {
  console.log('updating a recipe');

  const recipeID = req.params.recipeID;
  const auth = req.authorization;
  const data = recipes.update(recipeID, auth);

  res.setHeader('content-type', data.contentType);
  res.send(data.code, data.response);
  res.end();
});

server.del('/recipes/:recipeID', function(req, res) {
  console.log('deleting recipe from saved recipes');

  const recipeID = req.params.recipeID;
  const auth = req.authorization;
  const data = recipes.delByID(recipeID, auth);

  res.send(data.code, data.response);
  res.end();
});

var port = process.env.PORT || 8080;
server.listen(port, function (err) {
  if (err) {
	console.error(err);
  } else {
	console.log('Serving on port: ' + port);
  }
});
