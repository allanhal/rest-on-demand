const MongoClient = require('mongodb').MongoClient;
var apiAluno = require('./apiAluno.ts');

var collections = ['pedido', 'produto'];
var db; // mongoDatabase
var dbUrl = 'mongodb://user:user@ds123124.mlab.com:23124/easy-rest';


this.start = function (app) {
    var that = this;
    MongoClient.connect(dbUrl, function (err, database) {
        if (err) {
            return this.log(err);
        }
        db = database;

        apiAluno.create(app, db);

        app.listen(app.get('port'), function () {
            that.loadAllCollections(db);
            that.log('');
            that.log('Node app is running on port:');
            that.log(app.get('port'));
            that.log('');
        });
    });

    /* ================================================================== */
    /* ======================= CREATE COLLECTION ======================== */
    /* ================================================================== */
    app.get('/create/:col', function (req, res) {
        var collectionToCreate = req.params.col
        db.createCollection(collectionToCreate, function (err, res) {
            if (err) throw err;
            this.loadAllCollections()
        });
        res.json("Collection " + collectionToCreate + " created!");
    });
}

this.createApiMongoForAllCollections = function (collections) {
    collections.forEach(function (collection) {
        this.createApiMongo(collection)
    }, this);
}

this.createApiMongo = function createApiMongo(db, collection) {
    /* ================================================================== */
    /* =========================== API REST ============================= */
    /* ================================================================== */

    var apiUrl = '/api/' + collection;

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

this.loadAllCollections = function (db) {
    var that = this;
    db.listCollections().toArray(function (err, collInfos) {
        var colls = [];

        that.log('');
        that.log('All MongoDB collections:');
        for (var key in collInfos) {
            if (collInfos.hasOwnProperty(key)) {
                var element = collInfos[key];
                that.log(element.name)
                colls.push(element.name)
            }
        }
        that.log('');
        collections = colls;
        that.createApiMongoForAllCollections(collections)
    });
}

var debug = false;
this.log = function (message) {
    if (debug)
        return console.log(message)

    return false;
}