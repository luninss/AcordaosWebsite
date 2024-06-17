var express = require('express');
var router = express.Router();
var axios = require('axios');
var jwt = require('jsonwebtoken');
var autenticacao = require('../verifyAcess/acess');

const api = 'http://localhost:16000/';
const aut = 'http://localhost:16001/';
/* GET home page. */
router.get('/', async function(req, res, next) {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  tribunal = '';

  let token = req.cookies.token;
  let username = '';
  if (token) {
    jwt.verify(token, 'PROJETO-EW', function(err, decoded) {
      if (err) {
        username = '';
      } else {
        username = decoded.username;
      }
    });
  } else {
    username = '';
  }
  var favoritos = [];

  if (username != '') {
    await axios.get(`${api}users/${username}/favorites?token=${token}`)
      .then(response => {
        favoritos = response.data.acordaos;
      })
      .catch(error => {
        res.render('error', { error: error });
      });
  }
  await axios.get(`${api}acordaos?page=${page}&limit=${limit}`)
    .then(response => {
      res.render('index', { acordaos: response.data.acordaos, page: page, totalPages: response.data.totalPages, favoritos: favoritos });
    })
    .catch(error => {
      res.render('error', { error: error });
    });
});

module.exports = router;


// login, signup e perfis

router.get('/login', function(req, res, next) {
  let token = req.cookies.token;
  if (token) {
    jwt.verify(token, 'PROJETO-EW', function(err, decoded) {
      if (err) {
        res.render('login', { error: 'Token inválido, se erro persistir, limpar cookies' });
      } else {
        res.render('login', { error: 'Utilizador já autenticado'})
      }
    });
  } else {
    res.render('login');
  }
});

router.post('/login', function(req, res, next) {
  axios.post(`${aut}login`, req.body)
    .then(response => {
      res.cookie('token', response.data.token);
      res.redirect('/');
    })
    .catch(error => {
      res.render('login', { error: error.response.data.error }, {teste: 'teste'});
    });
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.get('/signupADMIN', autenticacao.verificaAdmin, function(req, res, next) {
  res.render('signupADMIN');
});

router.post('/signup', async function(req, res, next) {
  await axios.post(`${aut}register`, req.body)
    .then(response => {
      res.redirect('/login');
    })
    .catch(error => {
      res.render('signup', { error: error.response.data.error });
    });
});

router.post('/signupADMIN', async function(req, res, next) {
  let token = req.cookies.token;
  await axios.post(`${aut}registerADMIN?token=${token}`, req.body)
    .then(response => {
      res.redirect('/');
    })
    .catch(error => {
      res.render('signup', { error: error.response.data.error });
    });
});


router.get('/logout', function(req, res, next) {
  res.clearCookie('token');
  res.redirect('/login');
});



router.get('/perfil', autenticacao.verificaAcesso ,function(req, res, next) {
  let token = req.cookies.token;
  let username = '';
  if (token) {
    jwt.verify(token, 'PROJETO-EW', function(err, decoded) {
      if (err) {
        console.log('erro')
        res.redirect('/login');
      } else {
        username = decoded.username;
      }
    });
  } else {
    console.log('ei')
    res.redirect('/login');
  }

  axios.get(`${api}users/${username}?token=${token}`)
    .then(response => {
      res.render('perfil', { user: response.data.dados });
    })
    .catch(error => {
      res.render('error', { error: error });
    });
});

router.post('/update-password', autenticacao.verificaAcesso, function(req, res, next) {
  let token = req.cookies.token;
  let username = '';
  if (token) {
    jwt.verify(token, 'PROJETO-EW', function(err, decoded) {
      if (err) {
        res.redirect('/login');
      } else {
        username = decoded.username;
      }
    });
  } else {
    res.redirect('/login');
  }

  axios.put(`${aut}users/${username}?token=${token}`, req.body)
    .then(response => {
      res.redirect('/perfil');
    })
    .catch(error => {
      res.render('error', { error: error });
    });
    res.redirect('/perfil')
});

router.get('/favoritos', autenticacao.verificaAcesso, async function(req, res, next) {
  let token = req.cookies.token;
  let username = '';
  if (token) {
    jwt.verify(token, 'PROJETO-EW', function(err, decoded) {
      if (err) {
        res.redirect('/login');
      } else {
        username = decoded.username;
      }
    });
  } else {
    res.redirect('/login');
  }


  await axios.get(`${api}users/${username}/favorites?token=${token}`)
    .then(response => {
      res.render('favorites', { acordaos: response.data.acordaos });
    })
    .catch(error => {
      res.render('error', { error: error });
    });
});

router.post('/acordao/favorite/:id', autenticacao.verificaAcesso, function(req, res, next) {
  let token = req.cookies.token;
  let username = '';
  if (token) {
    jwt.verify(token, 'PROJETO-EW', function(err, decoded) {
      if (err) {
        res.redirect('/login');
      } else {
        username = decoded.username;
      }
    });
  } else {
    res.redirect('/login');
  }

  axios.put(`${api}users/${username}/favorites/${req.params.id}?token=${token}`)
    .then(response => {
      res.redirect('/favoritos');
    })
    .catch(error => {
      res.render('error', { error: error });
    });
});

router.post('/acordao/unfavorite/:id', autenticacao.verificaAcesso, function(req, res, next) {
  let token = req.cookies.token;
  let username = '';
  if (token) {
    jwt.verify(token, 'PROJETO-EW', function(err, decoded) {
      if (err) {
        res.redirect('/login');
      } else {
        username = decoded.username;
      }
    });
  } else {
    res.redirect('/login');
  }

  axios.delete(`${api}users/${username}/favorites/${req.params.id}?token=${token}`)
    .then(response => {
      res.redirect('/favoritos');
    })
    .catch(error => {
      res.render('error', { error: error });
    });
});