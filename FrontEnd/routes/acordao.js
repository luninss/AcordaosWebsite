var express = require('express');
var router = express.Router();
var axios = require('axios');

const api = 'http://localhost:16000/';


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


module.exports = router;
