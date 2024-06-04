var express = require('express');
var router = express.Router();
var tribunal = require('../controllers/tribunal');

router.get('/', function(req, res) {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;

  tribunal.list(page, limit)
    .then(result => res.jsonp({ tribunais: result.data, totalPages: result.totalPages }))
    .catch(error => res.jsonp(error));
});

router.get('/:id', function(req, res) {
  tribunal.lookUp(req.params.id)
    .then(data => res.jsonp(data))
    .catch(error => res.jsonp(error));
});

router.post('/', function(req, res) {
  tribunal.insert(req.body)
    .then(data => res.jsonp(data))
    .catch(error => res.jsonp(error));
});

router.put('/:id', function(req, res) {
  tribunal.update(req.params.id, req.body)
    .then(data => res.jsonp(data))
    .catch(error => res.jsonp(error));
});

router.delete('/:id', function(req, res) {
  tribunal.delete(req.params.id)
    .then(data => res.jsonp(data))
    .catch(error => res.jsonp(error));
});

module.exports = router;
