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

const path = require('path');
const fs = require('fs');
const multer = require('multer');

app.use(express.json());
app.use(cors())

// Servir arquivos estáticos (imagens enviadas)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname)));

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + unique + ext);
  }
});
const upload = multer({ storage: storage });

// Helper: posts.json path
const POSTS_FILE = path.join(__dirname, 'posts.json');

function readPosts() {
  try {
    const data = fs.readFileSync(POSTS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    return [];
  }
}

function writePosts(posts) {
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
}

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

    // Login bem-sucedido
    const user = results[0];
    res.json({
      message: 'Login bem-sucedido',
      user: {
        id: user.id,
        email_usuario: email,
        senha_usuario: password        
      }
    });
  });
});


// (listener moved to bottom after routes) - will listen after routes are defined

// Rota para upload de imagem (novo post)
app.post('/upload-imagem', upload.single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Arquivo não enviado' });

    const caption = req.body.caption || '';
    const user = req.body.user || '@anônimo';

    const post = {
      id: Date.now(),
      imageUrl: `/uploads/${req.file.filename}`,
      caption: caption,
      user: user,
      avatar: req.body.avatar || 'imagens/eu.jpg',
      createdAt: Date.now()
    };

    const posts = readPosts();
    posts.push(post);
    writePosts(posts);

    res.status(201).json({ message: 'Upload feito', post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Rota GET - retorna posts salvos
app.get('/posts', (req, res) => {
  const posts = readPosts();
  res.json(posts);
});

// Inicializa o servidor (após definição de rotas)
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});