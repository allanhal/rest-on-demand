const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const path = require('path');
var compression = require('compression')

const app = express();

var apiUrl;

var db; // mongoDatabase
var dbUrl = 'mongodb://user:user@ds123124.mlab.com:23124/easy-rest';

var collections = ['pedido', 'produto'];

app.set('port', (process.env.PORT || 5000));

app.use(compression())

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

app.use('/', express.static('public'));

MongoClient.connect(dbUrl, function (err, database) {
  if (err) {
    return log(err);
  }
  db = database;

  apiAluno.create(app, db);

  app.listen(app.get('port'), function () {
    loadAllCollections();
    log('');
    log('Node app is running on port:');
    log(app.get('port'));
    log('');
  });
});

/* ================================================================== */
/* ======================= CREATE COLLECTION ======================== */
/* ================================================================== */
app.get('/create/:col', function (req, res) {
  var collectionToCreate = req.params.col
  db.createCollection(collectionToCreate, function (err, res) {
    if (err) throw err;
    loadAllCollections()
  });
  res.json("Collection " + collectionToCreate + " created!");
});

function loadAllCollections() {
  db.listCollections().toArray(function (err, collInfos) {
    var colls = [];

    log('');
    log('All MongoDB collections:');
    for (var key in collInfos) {
      if (collInfos.hasOwnProperty(key)) {
        var element = collInfos[key];
        log(element.name)
        colls.push(element.name)
      }
    }
    log('');
    collections = colls;
    createApiMongoForAllCollections()
  });
}

function createApiMongoForAllCollections() {
  collections.forEach(function (collection) {
    createApiMongo(collection)
  }, this);
}

function createApiMongo(collection) {
  /* ================================================================== */
  /* =========================== API REST ============================= */
  /* ================================================================== */

  apiUrl = '/api/' + collection;

  // Adicionar
  app.post(apiUrl, function (req, res) {
    var pedido = req.body;
    db.collection(collection).insert(pedido);
    res.json(pedido);
  });

  // Listar Todos
  app.get(apiUrl, function (req, res) {
    db.collection(collection).find().toArray(function (err, results) {
      res.json(results);
    });
  });

  // Ler Um
  app.get(apiUrl + '/:id', function (req, res) {
    var query = { "_id": ObjectId(req.params.id) };
    db.collection(collection).findOne(query, function (err, result) {
      res.json(result);
    });
  });

  // Atualizar
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

  // Deletar
  app.delete(apiUrl + '/:id', function (req, res) {
    var query = { "_id": ObjectId(req.params.id) };
    db.collection(collection).deleteOne(query, function (err, obj) {
      res.json(req.params.id);
    });
  });

}


function createApiSql() {
  /* ================================================================== */
  /* =========================== API REST ============================= */
  /* ================================================================== */

  var collection = 'usuarios'
  var apiUrl = '/sql/' + collection;

  // Adicionar
  app.post(apiUrl, function (req, res) {
    var pedido = req.body
    delete pedido.idusuarios;
    database.insertQuery(collection, pedido)
    res.json(pedido);
  });




  // Listar Todos
  app.get(apiUrl, function (req, res) {
    database.selectAll(collection, function (results) {
      res.json(results);
    })
  });

  // Ler Um
  app.get(apiUrl + '/:id', function (req, res) {
    var id = req.params.id

    database.selectQuery(collection, id, function (resultsUsuario) {
      resultsUsuario.forEach(function (element) {
        database.selectQuery(collection1, id, function (resultsTelas) {
          element.telas = resultsTelas;
          res.json(element);
        })
      }, this);
    })
  });

  // Atualizar
  app.put(apiUrl + '/:id', function (req, res) {
    var idToSearch = req.body.idusuarios
    var pedido = req.body
    delete pedido.idusuarios;
    database.update(collection, idToSearch, pedido, function (results) {
      res.json(results)
    })
  });

  // Deletar
  app.delete(apiUrl + '/:id', function (req, res) {
    var id = req.params.id

    database.delete(collection, id, function (results) {
      res.json(req.params.id)
    })
  });

  var collection1 = 'telas'
  var apiUrl1 = '/sql/' + collection1;

  // Adicionar
  app.post(apiUrl1, function (req, res) {
    var pedido = req.body
    delete pedido.idusuarios;
    database.insertQuery(collection1, pedido)
    res.json(pedido);
  });

  // Listar Todos
  app.get(apiUrl1, function (req, res) {
    database.selectAll(collection1, function (results) {
      res.json(results);
    })
  });

  // Ler Um
  app.get(apiUrl1 + '/:id', function (req, res) {
    var id = req.params.id

    database.selectQuery(collection1, id, function (results) {
      res.json(results);
    })
  });

  // Atualizar
  app.put(apiUrl1 + '/:id', function (req, res) {
    var idToSearch = req.body.idusuarios
    var nomeToSearch = req.body.Nome
    var pedido = req.body
    delete pedido.idusuarios;
    delete pedido.nome;


    database.selectQueryIdNome(collection1, idToSearch, nomeToSearch, function (results) {
      if (results.length > 0) {
        database.updateIdNome(collection1, idToSearch, nomeToSearch, req.body, function (results) {
          res.json(results)
        })
      } else {
        var pedido = req.body
        database.insertQuery(collection1, {
          idusuarios: idToSearch,
          Nome: nomeToSearch,
          tipo: req.body.tipo
        })
        res.json(req.body);
      }
    })
  });

  // Deletar
  app.delete(apiUrl1 + '/:id', function (req, res) {
    var id = req.params.id

    database.delete(collection1, id, function (results) {
      res.json(req.params.id)
    })
  });
}

var database = require('./server/ts/database.ts');
database.start();


createApiMongoForAllCollections()
createApiSql()

var apiAluno = require('./server/ts/apiAluno.ts');



const debug = false;
function log(message) {
  if (debug)
    return console.log(message)

  return false;
}

app.get('/api', function (req, res) {
  db.listCollections().toArray(function (err, colInfos) {
    let cols = [];

    colInfos.forEach(col => {
      cols.push(col.name)
    })
    res.send(cols)
  });
});