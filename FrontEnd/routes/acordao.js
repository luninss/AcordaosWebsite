var express = require('express');
var router = express.Router();
var axios = require('axios');

const api = 'http://localhost:16000/';



router.get('/tribunal/:id', function(req, res, next) {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  tribunal = 'do tribunal ' + req.params.id;

  axios.get(`${api}acordaos/tribunal/${req.params.id}`)
    .then(response => {
      res.render('index', { acordaos: response.data.acordaos, page: page, totalPages: response.data.totalPages});
    })
    .catch(error => {
      res.render('error', { error: error });
    });
});

router.get('/adicionar', function(req, res, next) {
  axios.get(`${api}tribunais`)
      .then(response => {
        res.render('newacordao', { tribunais: response.data.tribunais});
      })
      .catch(error => {
        res.render('error', { error: error });
      });
});

router.post('/adicionar', async (req, res) => {
  try {
    const acordaoData = {
      processo: req.body.processo,
      data_acordao: req.body.data_acordao,
      tribunal: req.body.tribunal,
      relator: req.body.relator,
      descritores: req.body.descritores.split(','), 
      numero_convencional: req.body.numero_convencional,
      numero_documento: req.body.numero_documento,
      votacao: req.body.votacao,
      texto_integral: req.body.texto_integral,
      url: req.body.url,
      outros_campos: {
        requerente: req.body['outros_campos[requerente]'],
        requerido: req.body['outros_campos[requerido]'],
        privacidade: req.body['outros_campos[privacidade]'],
        normas_apreciadas: req.body['outros_campos[normas_apreciadas]'],
        normas_julgadas_inconst: req.body['outros_campos[normas_julgadas_inconst]'],
        area_tematica_1: req.body['outros_campos[area_tematica_1]'],
        area_tematica_2: req.body['outros_campos[area_tematica_2]'],
        decisao: req.body['outros_campos[decisao]'],
        sumario: req.body['outros_campos[sumario]'],
      },
    };
    await axios.post(`${api}acordaos`, acordaoData);
    res.redirect('/'); 
  } catch (error) {
    res.status(500).send('Erro ao criar acordão: ' + error.message);
  }
});

/* GET home page. */
router.get('/:id', function(req, res, next) {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;

  axios.get(`${api}acordaos/${req.params.id}`)
    .then(response => {
      res.render('acordao', { acordao : response.data});
    })
    .catch(error => {
      res.render('error', { error: error });
    });
});


module.exports = router;
