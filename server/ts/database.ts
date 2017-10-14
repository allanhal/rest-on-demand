const { Client } = require('pg')
var client;
var knex;

this.start = function () {
    this.connectDatabase()
    this.createTables('pedido')
    /*
    exports.insertQuery('pedido', {
        nome: "Cliente 3",
        telefone: "Cliente 3",
        email: "Cliente 3",
        tipo: "RodaLivre",
        tamanho: "Catalina46",
        quadro: "Branco",
        garfo: "Branco",
        guidao: "Riser",
        aro: "Preto",
        pedivela: "Preto",
        preco: "R$ 1.700,00",
        tempo: "3 dias"
    })
    */
    // exports.selectQuery('pedido');
}

this.connectDatabase = function () {
    knex = require('knex')({
        client: 'pg',
        connection: {
            host: 'ec2-54-163-229-169.compute-1.amazonaws.com',
            user: 'zjzusygdjbipcu',
            password: 'a75d531701372f5c5fdcc533948fe0f6b5acc2a91d1f10d11852b107600a5807',
            database: 'dvk3456hdf96p',
            port: 5432,
            ssl: true
        }
    });
}

this.createTables = function (table) {
    knex.schema.createTableIfNotExists(table, function (table) {
        table.increments('_id').primary();
        table.string('nome');
        table.string('telefone');
        table.string('email');
        table.string('tipo');
        table.string('tamanho');
        table.string('quadro');
        table.string('garfo');
        table.string('guidao');
        table.string('aro');
        table.string('pedivela');
        table.string('preco');
        table.string('tempo');
        table.timestamps();
    })
        .then(function (values) {
            console.log(values);
        });
}

this.insertQuery = function (table, json) {
    knex(table).insert(json).
        then(function (values) {
            console.log(values);
        });
}

this.selectAll = function (table, onResult) {
    knex(table).then(function (result) {
        onResult(result);
    });
}

this.selectQuery = function (table, id, onResult) {
    knex(table).where('_id', id).then(function (result) {
        onResult(result);
    });
}

this.update = function (table, pedido, onResult) {
    var id = pedido.id;

    knex(table)
        .where('_id', id)
        .update(pedido)
        .then(function (result) {
            onResult(result);
        });
}

this.delete = function (table, id, onResult) {
    knex(table)
        .where('_id', id)
        .del()
        .then(function (result) {
            onResult(result);
        });
}
