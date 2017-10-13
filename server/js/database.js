
var fs = require('fs');
const path = require('path');
const { Client } = require('pg')
var client;

var knex;

exports.start = function () {
    var initSql = fs.readFileSync('server/sql/init_database.sql').toString();
    exports.connectDatabase()
    exports.executeQuery(initSql)

    exports.insert()

    var output = knex.select('id', 'nome').from('pedido').toString()
    console.log(output)
    exports.executeQuery(output)
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

    client = new Client({
        host: 'ec2-54-163-229-169.compute-1.amazonaws.com',
        database: 'dvk3456hdf96p',
        port: 5432,
        user: 'zjzusygdjbipcu',
        password: 'a75d531701372f5c5fdcc533948fe0f6b5acc2a91d1f10d11852b107600a5807',
        ssl: true
    })

    client.connect()
}

exports.insert = function () {
    const insert = 'insert into pedido (id, nome, telefone, email, tipo, tamanho, quadro, garfo, guidao, aro, pedivela, preco, tempo ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13 ) RETURNING *'
    const values = [1, 'nome', 'telefone', 'email', 'tipo', 'tamanho', 'quadro', 'garfo', 'guidao', 'aro', 'pedivela', 'preco', 'tempo']

    // client.query(insert1, values, (err, res) => {
    //     if (err) {
    //         console.log(err.stack)
    //     }
    // })

    client.query(insert, values)
        // .then(res => {
        //     console.log(res.rows[0])
        //     // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
        // })
        .catch(e => console.error(e.stack))

}

exports.executeQuery = function (text, values) {
    // callback
    // client.query(text, values, (err, res) => {
    //     if (err) {
    //         console.log(err.stack)
    //     } else {
    //         if (res.rows) {
    //             if (res.rows.length > 0) {
    //                 console.log(res.rows[0])
    //             } else {
    //                 console.log('Query with 0 rows')
    //             }
    //         } else {
    //             console.log('Query with no result')
    //         }
    //     }
    // })

    client.query(text, values)
        .then(res => {
            if (res.rows) {
                if (res.rows.length > 0) {
                    console.log(res.rows[0])
                } else {
                    console.log('Query with 0 rows')
                }
            } else {
                console.log('Query with no result')
            }
        })
        .catch(e => console.error(e.stack))
}

exports.runQuery = function (text) {
    client.query(text)
        .then(res => console.log(res.rows[0]))
        .catch(e => console.error(e.stack))
}
