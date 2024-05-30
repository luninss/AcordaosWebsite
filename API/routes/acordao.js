var express = require('express');
var router = express.Router();
var fs = require('fs');
var acordao = require('../controllers/acordao')


router.get('/', function(req, res) {
  acordao.list()
        .then(data => res.jsonp(data))
        .catch(erro => res.jsonp(erro))
});

router.get('/:id', function(req, res) {
  acordao.lookUp(req.params.id)
        .then(data => res.jsonp(data))
        .catch(erro => res.jsonp(erro))
});

router.post('/', function(req, res) {
  acordao.insert(req.body)
        .then(data => res.jsonp(data))
        .catch(erro => res.jsonp(erro))
});

router.put('/:id', function(req, res) {
  acordao.update(req.params.id, req.body)
        .then(data => res.jsonp(data))
        .catch(erro => res.jsonp(erro))
});

router.delete('/:id', function(req, res) {
  acordao.delete(req.params.id)
        .then(data => res.jsonp(data))
        .catch(erro => res.jsonp(erro))
});


module.exports = router;
