create database rede;

use rede;

create table posts(
	id_post int unsigned NOT NULL AUTO_INCREMENT,
    imagem VARCHAR(255) NOT NULL,
    legenda_post varchar(1000) not null,
    primary key(id_post)
    )default charset = utf8;
        
    
create table pessoa(
	id_pessoa int unsigned NOT NULL AUTO_INCREMENT,
    nome_completo varchar(50) not null,
    idade varchar(2) not null,
    user_pessoa varchar (20) not null,
	email_usuario varchar(60) not null,
    senha_usuario int not null,
    primary key(id_pessoa)
    )default charset = utf8;
     
select * from pessoa;