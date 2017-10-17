--CREATE DATABASE teste /*!40100 DEFAULT CHARACTER SET utf8 */;
/*
drop TABLE telas
drop table usuarios

CREATE TABLE usuarios (
  idusuarios int NOT NULL IDENTITY(1,1),
  Nome varchar(180) NOT NULL,
  Ativo int NOT NULL DEFAULT 1,
  datacriacao datetime NOT NULL,
  PRIMARY KEY (idusuarios)
) 



CREATE TABLE telas (
  Nome varchar(180) NOT NULL,
  idusuarios int NOT NULL,
  tipo varchar NOT NULL,
  PRIMARY KEY (nome,idusuarios),
  CONSTRAINT fktelas_usuarios FOREIGN KEY (idusuarios) REFERENCES usuarios (idusuarios)
)
*/


-- select * from usuarios u left join telas t on (u.idusuarios = t.idusuarios)

--INSERT INTO telas (nome, idusuarios, tipo) VALUES (1, 2, "Tela");

select * from usuarios
select * from telas

-- select * from telas