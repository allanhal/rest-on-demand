var fs = require('fs');
const path = require('path');
const { Client } = require('pg')
var client;
var knex;

exports.start = function () {
    exports.connectDatabase()
    exports.createTables()
    /*
    exports.insertQuery('pedido', {
        nome: "Cliente 1",
        telefone: "88-99999-88888",
        email: "email@email.com",
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

exports.connectDatabase = function (params) {
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

exports.createTables = function () {
    knex.schema.createTableIfNotExists('pedido', function (table) {
        table.increments();
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

exports.insertQuery = function (table, json) {
    knex(table).insert(json).
        then(function (values) {
            console.log(values);
        });
}

// exports.selectQuery = function (table) {
//     knex.select("*").from(table).then(function (values) {
//         console.log(values);
//     });
// }

exports.selectQuery = function (table, onResult) {
    knex.select("*").from(table).then(function (result) {
        onResult(result);
    });
}
