var express = require('express');
var app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({extended: false}));
app.use("/public", express.static(__dirname + "/public"));
app.use(function(req, res, next) {
  let { method, url } = req;
  let ip = req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress ||
    null;

  console.log(`${method} ${url} - ${ip}`);
  next();
}
);

function home(req, res) {
  const absolutePath = __dirname + '/views/index.html';
  res.sendFile(absolutePath);
}

function jsonRes(req, res) {
  let secretStyle = process.env['MESSAGE_STYLE'];
  console.log('ENV: ', secretStyle);
  let response = {"message": "Hello json"};
  let msg = "Hello json";

  if (secretStyle === "uppercase") {
    msg = msg.toUpperCase();
  }

  response["message"] = msg;

  res.json(response);
}

function timeMiddlereNow(req, res, next) {
  req.time = new Date().toString();
  next();
}

function timeNow(req, res) {
  res.json({"time": req.time})
}

function echo(req, res) {
  let word = req.params.word;
  res.json({"echo": word});
}


function handleName(req, res) {
  let { first, last } = req.query;
  res.json({ "name": `${first} ${last}`});
}

function handleBody(req, res) {
  let { first, last } = req.body;
  console.log('req: ', req.body);
  res.json({ "name": `${first} ${last}`});
}


app.get('/', home);
app.get('/json', jsonRes);
app.get('/now', timeMiddlereNow, timeNow); 
app.get('/:word/echo', echo);
app.route('/name').get(handleName).post(handleBody);



