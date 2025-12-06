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
app.use(cors());

const PORT = process.env.PORT || 3000;

// Rota POST - Cadastrar novo usuario
app.post('/cadUsuario', (req, res) => {
  const { nome_completo, idade, user_pessoa, email_usuario, senha_usuario } = req.body;

  if (!nome_completo || !idade || !user_pessoa || !email_usuario || !senha_usuario) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  const sql = 'INSERT INTO pessoa (nome_completo, idade, user_pessoa, email_usuario, senha_usuario) VALUES (?,?,?,?,?)';
  db.query(sql, [nome_completo, idade, user_pessoa, email_usuario, senha_usuario], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Essa conta já está cadastrada' });
      }
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({ message: 'Conta cadastrada com sucesso', id: result.insertId });
  });
});

// Rota POST - Login
app.post('/cadConta', (req, res) => {
  const { email_usuario, senha_usuario } = req.body;

  if (!email_usuario || !senha_usuario) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  const sql = 'SELECT * FROM pessoa WHERE email_usuario = ? AND senha_usuario = ?';
  db.query(sql, [email_usuario, senha_usuario], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = results[0]; // Pegando o primeiro usuário encontrado
    res.json({
      message: 'Login bem-sucedido',
      user: {
        id: user.id,
        email_usuario: user.email_usuario, // Corrigido para retornar a variável correta
        senha_usuario: user.senha_usuario // Corrigido para retornar a variável correta
      }
    });
  });
});

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});