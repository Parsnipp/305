const restify = require('restify');
const server = restify.createServer();

server.use(restify.fullResponse());
server.use(restify.bodyParser());
server.use(restify.authorizationParser());

const remote = require('./modules/remote.js');
const create = require('./crud/create.js');
const read = require('./crud/read.js');
const update = require('./crud/update.js');
const destroy = require('./crud/destroy.js');
const account = require('./users/account_handler.js');

server.get('/', (req, res, next) => {
  res.redirect('/recipes', next);
});

server.get('/recipes', (req, res) => {
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

server.get('/recipes/search/:name', (req, res) => {
	console.log('getting recipes by name');

	const name = req.params.name;
	const host = req.headers.host;
	remote.search(host, name, data => {

		res.setHeader('content-type', 'application/json');
	  res.send(data.code, data.response);
	  res.end();
  });
});

server.get('/recipes/remote/:recipeID', (req, res) => {
	const id = req.params.recipeID;
	const host = req.headers.host;
	remote.single(host, id, data => {

		res.setHeader('content-type', 'application/json');
	  res.send(data.code, data.response);
	  res.end();
	});
});

server.get('/recipes/:recipeID', (req, res) => {
  console.log("getting a recipe based on it's ID");

  const recipeID = req.params.recipeID;
  read.byID(recipeID, data => {

	  res.setHeader('content-type', 'application/json');
	  res.send(data.code, data.response);
	  res.end();
  });
});

server.post('/recipes', (req, res) => {
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

server.put('/recipes/:recipeID', (req, res) => {
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

server.del('/recipes/:recipeID', (req, res) => {
  console.log('deleting recipe from saved recipes');

  const recipeID = req.params.recipeID;
  const auth = req.authorization;
  destroy.byID(recipeID, auth, data => {

	  res.send(data.code, data.response);
	  res.end();
  });
});

server.get('/user', (req, res) => {
	console.log('login attempt');
	const auth = req.authorization;
	const details = { username: auth.basic.username, password: auth.basic.password};
	account.login(details, data => {
		const message = data.split(':');
		if (message[0] === 'error') {
			var code = 401;
			var response = { status:'error', message:'invalid credentials' };
		} else {
			var code = 200;
			var response = { status: 'success', message: 'credentials accepted'};
		};

		res.send(code, response);
		res.end();
	});
});

server.post('/user', (req, res) => {
	const auth = req.authorization;
	const details = { username: auth.basic.username, password: auth.basic.password};
	account.create(details, data => {
		const message = data.split(':');
		if (message[0] === 'error') {
			var code = 401;
			var response = { status:'error', message:'invalid credentials' };
		} else {
			var code = 201;
			var response = { status: 'success', message: 'account created'};
		};

		res.send(code, response);
		res.end();
	});
});

server.put('/user', (req, res) => {
	const auth = req.authorization;
	const details = { username: auth.basic.username, password: auth.basic.password};
	account.update(details, data => {
		const message = data.split(':');
		if (message[0] === 'error') {
			var code = 401;
			var response = { status:'error', message:'invalid credentials' };
		} else {
			var code = 201;
			var response = { status: 'success', message: 'account updated'};
		};

		res.send(code, response);
		res.end();
	});
});

server.del('/user', (req, res) => {
	const auth = req.authorization;
	const details = { username: auth.basic.username, password: auth.basic.password};
	account.delete(details, data => {
		const message = data.split(':');
		if (message[0] === 'error') {
			var code = 401;
			var response = { status:'error', message:'invalid credentials' };
		} else {
			var code = 200;
			var response = { status: 'success', message: 'account deleted'};
		};

		res.send(code, response);
		res.end();
	});
});

var port = process.env.PORT || 8080;
server.listen(port, err => {
  if (err) {
		console.error(err);
  } else {
		console.log('Serving on port: ' + port);
  }
});
