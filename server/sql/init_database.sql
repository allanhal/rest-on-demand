DROP TABLE pedido;

CREATE TABLE pedido (
    id int NOT NULL,
    nome varchar(255),
    telefone varchar(255),
    email varchar(255),
    tipo varchar(255),
    tamanho varchar(255),
    quadro varchar(255),
    garfo varchar(255),
    guidao varchar(255),
    aro varchar(255),
    pedivela varchar(255),
    preco varchar(255),
    tempo varchar(255),
    PRIMARY KEY (id)
);