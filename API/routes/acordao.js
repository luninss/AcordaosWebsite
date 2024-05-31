var express = require('express');
var router = express.Router();
var acordao = require('../controllers/acordao');

router.get('/', function(req, res) {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;

  acordao.list(page, limit)
    .then(result => res.jsonp({ acordaos: result.data, totalPages: result.totalPages }))
    .catch(error => res.jsonp(error));
});

router.get('/:id', function(req, res) {
  acordao.lookUp(req.params.id)
    .then(data => res.jsonp(data))
    .catch(error => res.jsonp(error));
});

router.post('/', function(req, res) {
  acordao.insert(req.body)
    .then(data => res.jsonp(data))
    .catch(error => res.jsonp(error));
});

router.put('/:id', function(req, res) {
  acordao.update(req.params.id, req.body)
    .then(data => res.jsonp(data))
    .catch(error => res.jsonp(error));
});

router.delete('/:id', function(req, res) {
  acordao.delete(req.params.id)
    .then(data => res.jsonp(data))
    .catch(error => res.jsonp(error));
});

module.exports = router;
