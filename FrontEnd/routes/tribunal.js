var express = require('express');
var router = express.Router();
var axios = require('axios');
var autenticacao = require('../verifyAcess/acess');

const api = process.env.API || 'http://localhost:16000/api/';



router.get('/adicionar', autenticacao.verificaAdmin,function(req, res, next) {
  res.render('newtribunal');
});

router.post('/adicionar', autenticacao.verificaAdmin, async (req, res) => {
  try {
    const nome = req.body.nome;
    const apiUrl = `${api}tribunais/${nome}`;
    await axios.post(apiUrl);
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Erro ao criar tribunal: ' + error.message);
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
    axios.get(`${api}tribunais`)
      .then(response => {
        res.render('tribunal', { tribunais: response.data.tribunais});
      })
      .catch(error => {
        res.render('error', { error: error });
      });
});


router.get('/:id', function(req, res, next) {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  axios.get(`${api}tribunais/${req.params.id}`)
    .then(response => {
      res.render('tribunal', { tribunal : response.data});
    })
    .catch(error => {
      res.render('error', { error: error });
    });
});

module.exports = router;
