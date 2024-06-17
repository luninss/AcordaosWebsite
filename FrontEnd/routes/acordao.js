var express = require('express');
var router = express.Router();
var axios = require('axios');
var autenticao = require('../verifyAcess/acess');
const { verificaAdmin } = require('../verifyAcess/acess');
const moment = require('moment'); 
const api = process.env.API || 'http://localhost:16000/';
var jsonfile = require('jsonfile')
var multer = require('multer');
var upload = multer({ dest: 'uploads' })

router.get('/tribunal/:id', async function(req, res, next) {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  tribunal = req.params.id;
  await axios.get(`${api}acordaos/tribunal/${req.params.id}`)
    .then(response => {
      res.render('indexByTribunal', { acordaos: response.data.acordaos, page: page, totalPages: response.data.totalPages});
    })
    .catch(error => {
      res.render('error', { error: error });
    });
});



router.get('/adicionar', autenticao.verificaAdmin, function(req, res, next) {
  axios.get(`${api}tribunais`)
      .then(response => {
        res.render('newacordao', { tribunais: response.data.tribunais});
      })
      .catch(error => {
        res.render('error', { error: error });
      });
});

router.get('/adicionar/file', autenticao.verificaAdmin, function(req, res, next) {
  axios.get(`${api}tribunais`)
      .then(response => {
        res.render('newacordaoFile');
      })
      .catch(error => {
        res.render('error', { error: error });
      });
});

router.post('/adicionar/file', autenticao.verificaAdmin, upload.single('file'), async function(req, res, next) {
  const file = req.file.path;
  let token = req.cookies.token;
  jsonfile.readFile(file) 
      .then((content)=> {
        axios.post(`${api}acordaos/file?token=${token}`, content)
          .then(response => {
            res.redirect('/acordao/' + response.data._id);
          })
          .catch(error => {
            res.render('newacordaoFile', { error: error });
          });
      })
});

router.get('/edit/:idAcordao', autenticao.verificaAdmin, async function(req, res, next) {
  await axios.get(`${api}acordaos/${req.params.idAcordao}`)
      .then(resp=>{
        var Acordao = resp.data
        if (Acordao.data_acordao) {
          Acordao.data_acordao = moment(Acordao.data_acordao).format('YYYY-MM-DD');
        }
        axios.get(`${api}tribunais`)
          .then(response => {
            res.render('AcordaoEditPage', { tribunais: response.data.tribunais, "acordao": Acordao});
          })
          .catch(error => {
            res.render('error', { error: error });
          });
      })
      .catch(erro=>{
          res.status(504).render("erro",{"erro": erro})
      })
});

router.post('/edit/:idAcordao', autenticao.verificaAdmin, async function(req, res, next) {
  let token = req.cookies.token;
  try {
    const acordaoData = {
      _id: req.params.idAcordao,
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
    await axios.put(`${api}acordaos/${req.params.idAcordao}?token=${token}`,acordaoData)
      .then(resp=>{
          res.redirect('/acordao/' + req.params.idAcordao);
      })
      .catch(erro=>{
          res.status(502).render("erro",{"erro" : erro})
      })
  } catch (error) {
    res.status(500).send('Erro ao editar acordão: ' + error.message);
  }
});


router.get('/delete/:idAcordao', autenticao.verificaAdmin, async function(req, res, next) {
  let token = req.cookies.token;
  await axios.delete(`${api}acordaos/${req.params.idAcordao}?token=${token}`)
      .then(resp=>{
          res.redirect('/')
      })
      .catch(erro=>{
          res.status(505).render("erro",{"erro": erro})
      })
});


router.post('/adicionar',autenticao.verificaAdmin, async (req, res) => {
  let token = req.cookies.token;
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
    await axios.post(`${api}acordaos/?token=${token}`,acordaoData)
      .then(resp=>{
          res.redirect('/acordao/' + resp.data._id);
      })
      .catch(erro=>{
          res.status(502).render("erro",{"erro" : erro})
      })
    res.redirect('/'); 
  } catch (error) {
    res.status(500).send('Erro ao criar acordão: ' + error.message);
  }
});

router.get('/:id', async function(req, res, next) {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;

  await axios.get(`${api}acordaos/${req.params.id}`)
    .then(response => {
      res.render('acordao', { acordao : response.data});
    })
    .catch(error => {
      res.render('error', { error: error });
    });
});


module.exports = router;
