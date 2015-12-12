const restify = require('restify');
const server = restify.createServer();

server.use(restify.fullResponse());
server.use(restify.bodyParser());
server.use(restify.authorizationParser());

const recipes = require('./modules/recipes.js');
const create = require('./crud/create.js');
const read = require('./crud/read.js');
const update = require('./crud/update.js');
const destroy = require('./crud/destroy.js');

server.get('/', function(req, res, next) {
  res.redirect('/recipes', next);
});

server.get('/recipes/remote/:name', function(req, res) {
	console.log('getting recipes by name');

	const name = req.params.name;
	const host = req.headers.host;
	read.byName(host, name, data => {

		res.setHeader('content-type', 'application/json');
	  res.send(data.code, data.response);
	  res.end();
  });
});

server.get('/recipes', function(req, res) {
  console.log('getting a list of all recipes');

  const host = req.headers.host;
  console.log(host);

  if (req.header('Accept') === 'application/xml') {
    read.allXML(host, returned => {
    	res.setHeader('content-type', returned.contentType);
		  res.send(returned.code, returned.response);
		  res.end();
    });
  } else {
  	console.log('getting JSON');
    read.all(host, returned => {
    	res.setHeader('content-type', returned.contentType);
		  res.send(returned.code, returned.response);
		  res.end();
    });
  }
});

server.get('/recipes/:recipeID', function(req, res) {
  console.log("getting a recipe based on it's ID");

  const recipeID = req.params.recipeID;
  read.byID(recipeID, data => {

	  res.setHeader('content-type', 'application/json');
	  res.send(data.code, data.response);
	  res.end();
  });
});

server.post('/recipes', function(req, res) {
  console.log('adding recipe to saved recipes');

  const body = req.body;
  const auth = req.authorization;

  create.new(auth, body, data => {
  	console.log(data);

	  res.setHeader('content-type', data.contentType);
	  res.send(data.code, data.response);
	  res.end();
  });
});

server.put('/recipes/:recipeID', function(req, res) {
  console.log('updating a recipe');

  const recipeID = req.params.recipeID;
  const auth = req.authorization;
  update.item(recipeID, auth, data => {
	  console.log(data);

	  res.setHeader('content-type', data.contentType);
	  res.send(data.code, data.response);
	  res.end();
  });
});

server.del('/recipes/:recipeID', function(req, res) {
  console.log('deleting recipe from saved recipes');

  const recipeID = req.params.recipeID;
  const auth = req.authorization;
  destroy.byID(recipeID, auth, data => {

	  res.send(data.code, data.response);
	  res.end();
  });
});

var port = process.env.PORT || 8080;
server.listen(port, function (err) {
  if (err) {
	console.error(err);
  } else {
	console.log('Serving on port: ' + port);
  }
});
