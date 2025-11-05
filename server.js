//Dependências //Executar da primeira vez
//npm init -y
//npm install express mysql2 dotenv
//npm install cors

//Para executar o servidor
//nodemon server.js

const cors = require('cors');

const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();

app.use(express.json());
app.use(cors())

const PORT = process.env.PORT || 3000;

//Rota POST - Cadastrar novo usuario
app.post('/cadUsuario', (req, res) => {
  // As variáveis dentro dos {} recebem os dados que vieram do front-end
  const { nome_completo, idade, user_pessoa, email_usuario, senha_usuario } = req.body;

  //Se os dados que vieram do font-end forem em branco
  if (!nome_completo || !idade || !user_pessoa || !email_usuario || !senha_usuario) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  //Realiza a inserção dos dados recebidos no banco de dados
  const sql = 'INSERT INTO pessoa (nome_completo, idade, user_pessoa, email_usuario, senha_usuario) VALUES (?,?,?,?,?)';
  db.query(sql, [nome_completo, idade, user_pessoa, email_usuario, senha_usuario], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Essa conta já está cadastrada' });
      }
      return res.status(500).json({ error: err.message });
    }

    // Em caso de sucesso encaminha uma mensagem e o id do produto
    res.status(201).json({ message: 'Conta cadastrada com sucesso', id: result.insertId });
  });
});

//Rota GET - Cadastrar
app.get('/cadConta', (req, res) => {
  db.query('SELECT * FROM pessoa', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});