const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
var path = require('path');

var apiUrl;

var db; // mongoDatabase

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname));
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

app.use('/', express.static('public'));

MongoClient.connect('mongodb://user:user@ds123124.mlab.com:23124/easy-rest', function (err, database) {
  if (err) {
    return console.log(err);
  }
  db = database;
  app.listen(app.get('port'), function () {
    console.log('Node app is running on port => ', app.get('port'));
  });
});

/* ================================================================== */
/* ======================= CREATE COLLECTION ======================== */
/* ================================================================== */
app.get('/create/:id', function (req, res) {
  var collectionToCreate = req.params.id
  db.createCollection(collectionToCreate, null);
  res.json("Collection "+collectionToCreate + " created!");
});

var collections = ['pedido', 'produto'];
collections.forEach(function (collection) {
  /* ================================================================== */
  /* =========================== API REST ============================= */
  /* ================================================================== */

  apiUrl = '/api/' + collection;

  // Adicionar Pedido
  app.post(apiUrl, function (req, res) {
    var pedido = req.body;
    db.collection(collection).insert(pedido);
    res.json(pedido);
  });

  // Listar Pedidos
  app.get(apiUrl, function (req, res) {
    db.collection(collection).find().toArray(function (err, results) {
      res.json(results);
    });
  });

  // Ler Pedido
  app.get(apiUrl + '/:id', function (req, res) {
    var query = { "_id": ObjectId(req.params.id) };
    db.collection(collection).findOne(query, function (err, result) {
      res.json(result);
    });
  });

  // Atualizar Pedido
  app.put(apiUrl + '/:id', function (req, res) {
    var query = { "_id": ObjectId(req.params.id) };
    req.body._id = ObjectId(req.params.id);
    var pedido = req.body;

    db.collection(collection).update(query, req.body,
      {
        "multi": false,  // update only one document 
        "upsert": false  // insert a new document, if no existing document match the query 
      }
    );
    res.json(pedido);
  });

  // Deletar Pedido
  app.delete(apiUrl + '/:id', function (req, res) {
    var query = { "_id": ObjectId(req.params.id) };
    db.collection(collection).deleteOne(query, function (err, obj) {
      res.json(req.params.id);
    });
  });
}, this);