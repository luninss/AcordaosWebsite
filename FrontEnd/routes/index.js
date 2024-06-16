var express = require('express');
var router = express.Router();
var axios = require('axios');
var jwt = require('jsonwebtoken');

const api = 'http://localhost:16000/';
const aut = 'http://localhost:16001/';
/* GET home page. */
router.get('/', function(req, res, next) {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  tribunal = '';
  axios.get(`${api}acordaos?page=${page}&limit=${limit}`)
    .then(response => {
      res.render('index', { acordaos: response.data.acordaos, page: page, totalPages: response.data.totalPages });
    })
    .catch(error => {
      res.render('error', { error: error });
    });
});

module.exports = router;


// login e signup

router.get('/login', function(req, res, next) {
  let token = req.cookies.token;
  if (token) {
    jwt.verify(token, 'PROJETO-EW', function(err, decoded) {
      if (err) {
        res.render('login', { error: 'Token inválido, se erro persistir, limpar cookies' });
      } else {
        res.render('login', { error: 'Usuário já autenticado'})
      }
    });
  } else {
    res.render('login');
  }
});

router.post('/login', function(req, res, next) {
  console.log(req.body);
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

router.post('/signup', function(req, res, next) {
  axios.post(`${aut}register`, req.body)
    .then(response => {
      res.redirect('/login');
    })
    .catch(error => {
      res.render('signup', { error: error.response.data.error });
    });
});

router.get('/logout', function(req, res, next) {
  res.clearCookie('token');
  res.redirect('/');
});

router.get('/perfil', function(req, res, next) {
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

  axios.get(`${api}users/${username}?token=${token}`)
    .then(response => {
      console.log(response.data);
      res.render('perfil', { user: response.data.dados });
    })
    .catch(error => {
      res.render('error', { error: error });
    });


});