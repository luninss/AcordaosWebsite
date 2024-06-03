var express = require('express');
var router = express.Router();
var axios = require('axios');

const api = 'http://localhost:16000/';


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
/* GET home page. */
router.get('/', function(req, res, next) {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
  
    axios.get(`${api}tribunais?page=${page}&limit=${limit}`)
      .then(response => {
        res.render('index', { tribunais: response.data.tribunais, page: page, totalPages: response.data.totalPages });
      })
      .catch(error => {
        res.render('error', { error: error });
      });
});


module.exports = router;
