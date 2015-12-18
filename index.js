//set up server
const restify = require('restify');
const server = restify.createServer();

server.use(restify.fullResponse());
server.use(restify.bodyParser());
server.use(restify.authorizationParser());

//declare modules
const remote = require('./modules/remote.js'); //handler for all 3rd party calls
const create = require('./crud/create.js'); //handler for all create calls
const read = require('./crud/read.js'); //handler for all read calls
const update = require('./crud/update.js'); //handler for all update calls
const destroy = require('./crud/destroy.js'); //handler for all destroy calls
const account = require('./users/account_handler.js'); //handler for all user account calls

/* GET FUNCTIONS */
//redirect if get request does not declare location
server.get('/', (req, res, next) => {
  res.redirect('/recipes', next);
});

//get a list of all recipes in either JSON or XML
server.get('/recipes', (req, res) => {
  console.log('getting a list of all recipes');
  //create parameters for get function
  const host = req.headers.host;
  console.log(host);
  //check if XML was specified
  if (req.header('Accept') === 'application/xml') {
  	console.log('getting XML');
  	//if XML is declared get XML
    read.allXML(host, returned => {
    	res.setHeader('content-type', returned.contentType);
		  res.send(returned.code, returned.response);
		  res.end();
    });
  } else {
  	console.log('getting JSON');
  	//if XML is not declared get JSON
    read.all(host, returned => {
    	//assemble response headers
    	res.setHeader('content-type', returned.contentType);
    	//send response
		  res.send(returned.code, returned.response);
		  res.end();
    });
  };
});

//get a specific recipe from the data base by ID (called after getAll has returned recipes)
server.get('/recipes/:recipeID', (req, res) => {
  console.log("getting a recipe based on it's ID");
	//create parameters for get function
  const recipeID = req.params.recipeID;
  //call get function
  read.byID(recipeID, data => {
  	//assemble response headers
	  res.setHeader('content-type', 'application/json');
	  //send response
	  res.send(data.code, data.response);
	  res.end();
  });
});

//search 3rd party API for recipes by name
server.get('/recipes/search/:name', (req, res) => {
	console.log('getting recipes by name');
	//create parameters for get function
	const name = req.params.name;
	const host = req.headers.host;
	//call search function
	remote.search(host, name, data => {
		//assemble response headers
		res.setHeader('content-type', 'application/json');
		//send response
	  res.send(data.code, data.response);
	  res.end();
  });
});

//get a specific recipe from the 3rd party API by ID (called after search has returned recipes)
server.get('/recipes/remote/:recipeID', (req, res) => {
	//create parameters for get function
	const id = req.params.recipeID;
	const host = req.headers.host;
	//call 3rd party get function
	remote.single(host, id, data => {
		//assemble response headers
		res.setHeader('content-type', 'application/json');
		//send response
	  res.send(data.code, data.response);
	  res.end();
	});
});

/* POST FUNCTIONS */
//create a new recipe and add it to the database
server.post('/recipes', (req, res) => {
  console.log('adding recipe to saved recipes');
  //create parameters for the create function
  const body = req.body;
  const auth = req.authorization;
  //call create function
  create.new(auth, body, data => {
  	console.log(data);
  	//assemble response headers
	  res.setHeader('content-type', data.contentType);
	  //send response
	  res.send(data.code, data.response);
	  res.end();
  });
});

/* PUT FUNCTIONS */
//update a recipe in the database by ID (usually called after getItem)
server.put('/recipes/:recipeID', (req, res) => {
  console.log('updating a recipe');
  //create parameters for the update function
  const recipeID = req.params.recipeID;
  const body = req.body;
  const auth = req.authorization;
  //call update function
  update.item(recipeID, body, auth, data => {
	  console.log(data);
	  //assemble response headers
	  res.setHeader('content-type', data.contentType);
	  //send response
	  res.send(data.code, data.response);
	  res.end();
  });
});

/* DELETE FUNCTIONS */
//delete a recipe in the database by ID (usually called after getItem)
server.del('/recipes/:recipeID', (req, res) => {
  console.log('deleting recipe from saved recipes');
  //create parameters for delete function
  const recipeID = req.params.recipeID;
  const auth = req.authorization;
  //call delete function
  destroy.byID(recipeID, auth, data => {
  	//send response
	  res.send(data.code, data.response);
	  res.end();
  });
});

/* USER ACCOUNT FUNCTIONS */
//attempt to log in
server.get('/user', (req, res) => {
	console.log('login attempt');
	//create the login parameters
	const auth = req.authorization;
	const details = { username: auth.basic.username, password: auth.basic.password};
	//call the login function
	account.login(details, data => {
		const message = data.split(':');
		//with the user database function being called from index rather than the handler 
		//response is created here based on result
		if (message[0] === 'error') {
			var code = 401;
			var response = { status:'error', message:'invalid credentials' };
		} else {
			var code = 200;
			var response = { status: 'success', message: 'credentials accepted'};
		};
		//send response
		res.send(code, response);
		res.end();
	});
});

//attempt to create account
server.post('/user', (req, res) => {
	console.log('creating: '+req.authorization.basic.username);
	//create parameters for account creation
	const auth = req.authorization;
	const details = { username: auth.basic.username, password: auth.basic.password};
	//call create account function
	account.create(details, data => {
		const message = data.split(':');
		//with the user database function being called from index rather than the handler 
		//response is created here based on result
		if (message[0] === 'error') {
			var code = 401;
			var response = { status:'error', message:'invalid credentials' };
		} else {
			var code = 201;
			var response = { status: 'success', message: 'account created'};
		};
		//send response
		res.send(code, response);
		res.end();
	});
});

//update user account
server.put('/user', (req, res) => {
	console.log('updating: '+req.authorization.basic.username);
	//create parameters for updating account
	const auth = req.authorization;
	const details = { username: auth.basic.username, password: auth.basic.password};
	//call update account function
	account.update(details, data => {
		const message = data.split(':');
		//with the user database function being called from index rather than the handler 
		//response is created here based on result
		if (message[0] === 'error') {
			var code = 401;
			var response = { status:'error', message:'invalid credentials' };
		} else {
			var code = 201;
			var response = { status: 'success', message: 'account updated'};
		};
		//send response
		res.send(code, response);
		res.end();
	});
});

//delete user account
server.del('/user', (req, res) => {
	console.log('deleting: '+req.authorization.basic.username);
	//create parameters for account deletion
	const auth = req.authorization;
	const details = { username: auth.basic.username, password: auth.basic.password};
	//call delete account function
	account.delete(details, data => {
		const message = data.split(':');
		//with the user database function being called from index rather than the handler 
		//response is created here based on result
		if (message[0] === 'error') {
			var code = 401;
			var response = { status:'error', message:'invalid credentials' };
		} else {
			var code = 200;
			var response = { status: 'success', message: 'account deleted'};
		};
		//send response
		res.send(code, response);
		res.end();
	});
});

/* START SERVER */
//declare port
const port = process.env.PORT || 8080;
//call servers run function
server.listen(port, err => {
	//check if server has started
  if (err) {
		console.error(err);
  } else {
		console.log('Serving on port: ' + port);
  };
});
