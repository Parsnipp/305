var restify = require('restify');
var server = restify.createServer();

var mongoose = require('mongoose');
var database = 'recipes';

const dbserver = 'mongodb://localhost'+'/'+database;

console.log(dbserver);
mongoose.connect(dbserver);
const db = mongoose.connection;

server.use(restify.fullResponse());
server.use(restify.bodyParser());
server.use(restify.authorizationParser());

const recipeSchema = new mongoose.Schema({
//	_id: { type: String, required: true },
  name: { type: String },
  ingredients: [ { type: String } ],
  directions: { type: String }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

server.post('/', function(req, res) {
	console.log('posting');

	const body = req.body;

	console.log(body);

	const json = JSON.parse(body);

  console.log(typeof(json));

  const saveable = new Recipe(json);

  console.log(saveable);

  var data = saveable.save( (err, saveable) => {
  	console.log('running save');
  	if (err) {
  		console.log('error');
  		return {code: 400, contentType:'application/json', response:{ status:'error', message:'failed to save' }};
  	};
  	console.log('success')
  	return {code: 201, contentType:'application/json', response:{ status:'success', message:'new recipe added', data: saveable }};
  });

  res.setHeader('content-type', data.contentType);
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