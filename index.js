const express = require('express');
const bodyParser = require('body-parser');

const ObjectId = require('mongodb').ObjectID;
const path = require('path');
const compression = require('compression')

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(compression())

// app.use('/', express.static('public'));
app.use(express.static(path.join(__dirname, 'dist')))
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
  next();
});


var database = require('./server/ts/database.ts');
database.start(app)

var apisMongo = require('./server/ts/apisMongo.ts');
apisMongo.start(app)