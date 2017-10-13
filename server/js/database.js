
var fs = require('fs');
const path = require('path');
const Client = require('pg')


exports.start = function () {
    var initSql = fs.readFileSync('server/sql/init_database.sql').toString();
}

exports.connect = function (params) {
    const client = new Client({
        host: 'ec2-54-163-229-169.compute-1.amazonaws.com',
        database: 'dvk3456hdf96p',
        port: 5432,
        user: 'zjzusygdjbipcu',
        password: 'a75d531701372f5c5fdcc533948fe0f6b5acc2a91d1f10d11852b107600a5807',
        ssl: true
    })

    client.connect()
}

exports.insert = function (params) {
    const insert1 = 'insert into pedido (id, nome, telefone, email, tipo, tamanho, quadro, garfo, guidao, aro, pedivela, preco, tempo ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13 ) RETURNING *'
    const values = [1, 'nome', 'telefone', 'email', 'tipo', 'tamanho', 'quadro', 'garfo', 'guidao', 'aro', 'pedivela', 'preco', 'tempo']

    client.query(insert1, values, (err, res) => {
        if (err) {
            console.log(err.stack)
        } else {
            console.log('START - result for insert')
            console.log(res.rows[0])
            console.log('END - result for insert')
        }
    })
}
