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


module.exports = router;
