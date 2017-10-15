const ObjectId = require('mongodb').ObjectID;

this.create = function (app, db) {

    // Adicionar Nota
    app.post('/api/aluno/:id/nota', function (req, res) {

        var query = { "_id": ObjectId(req.params.id) };
        db.collection('aluno').findOne(query, function (err, result) {
            var alunoFound = result;

            var nota = req.body;

            if (!alunoFound.nota) {
                alunoFound.nota = []
            }

            alunoFound.nota.push(nota)

            db.collection('aluno').update(query, alunoFound,
                {
                    "multi": false,  // update only one document 
                    "upsert": false  // insert a new document, if no existing document match the query 
                }
            );

            res.json(alunoFound);

        });
    });

    app.get('/api/aluno/:id/nota', function (req, res) {
        console.log(req.params.id)
        res.json(req.params.id);
    });
}