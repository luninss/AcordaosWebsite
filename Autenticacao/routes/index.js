var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var passport = require('passport')
var axios = require('axios')
var userModel = require('../models/users')
var autenticacao = require('../verifyAcess/acess')
const api = process.env.API || 'http://localhost:16000/';

var User = require('../controllers/users');

async function getAcordaosByIdss(favoriteIDS){
    const response = await axios.get(`${api}acordaos/lista`, {data: {lista: favoriteIDS}})
    return response.data
}
router.get('/:id/favorites', autenticacao.verificaAcesso, async function(req, res){
    var token = req.query.token
    var username = jwt.decode(token).username
    if(req.params.id === username){
    User.getUser(req.params.id)
      .then(async dados => {
        const favoriteIds = dados.favoritos;
        const list = await getAcordaosByIdss(favoriteIds);
        res.status(200).jsonp({acordaos : list});
      })
      .catch(e => {
        console.log("Error:", e);
        res.status(500).jsonp({ error: e });
      });
    }else{
        res.status(403).jsonp({error: `[autenticacao] The user ${req.user.username} is not autenticacaoorized to access this information.`})
    }
});
  
  router.put('/:id/favorites/:idFav', autenticacao.verificaAcesso, function(req, res){
    var token = req.query.token
    var username = jwt.decode(token).username
    if(req.params.id === username){
    User.addFavorite(req.params.id, req.params.idFav)
      .then(dados => res.status(201).jsonp({dados: dados}))
      .catch(e => res.status(500).jsonp({error: e}))
    } else
        res.status(403).jsonp({error: `[autenticacao] The user ${req.user.username} is not autenticacaoorized to access this information.`})
  });
  
  router.delete('/:id/favorites/:idFav', autenticacao.verificaAcesso, function(req, res){
    var token = req.query.token
    var username = jwt.decode(token).username
    if(req.params.id === username){
    User.removeFavorite(req.params.id, req.params.idFav)
      .then(dados => res.status(201).jsonp({dados: dados}))
      .catch(e => res.status(500).jsonp({error: e}))
    }
    else
        res.status(403).jsonp({error: `[autenticacao] The user ${req.user.username} is not autenticacaoorized to access this information.`})
  });

router.get('/:username', autenticacao.verificaAcesso, function (req, res) {
    var token = req.query.token
    var username = jwt.decode(token).username
    if(req.params.username === username){
        User.getUser(req.params.username)
            .then(dados => res.status(200).jsonp({ dados: dados }))
            .catch(e => res.status(500).jsonp({ error: e }))
    }else
        res.status(403).jsonp({error: `[autenticacao] The user ${req.user.username} is not autenticacaoorized to access this information.`})
})

router.post('/registerADMIN', autenticacao.verificaAdmin ,async function (req, res) {
    var usernameCheck = await User.getUser(req.body.username)
    var emailCheck = await User.getUserByEmail(req.body.email)
    var token = req.query.token
    if (usernameCheck != null)  {
        console.log("Username already exists")
        res.status(409).jsonp({ error: 'Username already exists' })
        return
    }  
    if (emailCheck != null) {
        console.log("Email already exists")
        res.status(409).jsonp({ error: 'Email already exists' })
        return
    } 
    var d = new Date().toISOString()
    userModel.register(new userModel({
            favoritos: [],
            username: req.body.username, nome: req.body.nome, email: req.body.email,
            level: "admin", dataRegisto: d.substring(0, 10), dataUltimoAcesso: d.substring(0, 19)
        }),
        req.body.password,
        function (err, user) {
            if (err)
                res.jsonp({ error: err})
            else {
                passport.autenticacaoenticate("local")(req, res, () => {
                    jwt.sign({
                            username: req.user.username, level: req.user.level
                        },
                        "PROJETO-EW",
                        { expiresIn: 3600 },
                        function (e, token) {
                            if (e) res.status(500).jsonp({ error: e })
                            else res.status(201).jsonp({ token: token })
                        }
                    );
                })
            }
        }
    )
})

router.post('/register', async function (req, res) {
    var usernameCheck = await User.getUser(req.body.username)
    var emailCheck = await User.getUserByEmail(req.body.email)
    var token = req.query.token
    if (usernameCheck != null)  {
        console.log("Username already exists")
        res.status(409).jsonp({ error: 'Username already exists' })
        return
    }  
    if (emailCheck != null) {
        console.log("Email already exists")
        res.status(409).jsonp({ error: 'Email already exists' })
        return
    } 
    var d = new Date().toISOString()
    userModel.register(new userModel({
            favoritos: [],
            username: req.body.username, nome: req.body.nome, email: req.body.email,
            level: "normal", dataRegisto: d.substring(0, 10), dataUltimoAcesso: d.substring(0, 19)
        }),
        req.body.password,
        function (err, user) {
            if (err)
                res.jsonp({ error: err})
            else {
                passport.autenticacaoenticate("local")(req, res, () => {
                    jwt.sign({
                            username: req.user.username, level: req.user.level
                        },
                        "PROJETO-EW",
                        { expiresIn: 3600 },
                        function (e, token) {
                            if (e) res.status(500).jsonp({ error: e })
                            else res.status(201).jsonp({ token: token })
                        }
                    );
                })
            }
        }
    )
})

router.post('/registerAdmin', autenticacao.verificaAdmin,  function (req, res) {
    var d = new Date().toISOString()
    userModel.register(new userModel({
            username: req.body.username, name: req.body.name, email: req.body.email,
            level: "admin", dateCreated: d.substring(0, 10), lastAccess: d.substring(0, 19)
        }),
        req.body.password,
        function (err, user) {
            if (err)
                res.jsonp({ error: err})
            else {
                res.sendStatus(200)
            }
        }
    )
})

router.post('/login',  async function (req, res) {
    var user = await User.getUser(req.body.username)
    if (user == null) {
        console.log("Utilizador inexistente")
        res.status(401).jsonp({ error: 'Utilizador inexistente' })
        return
    }
    var levell = user.level
    jwt.sign({
            username: req.body.username, level: levell
        },
        "PROJETO-EW",
        { expiresIn: 7200 }, 
        function (e, token) {
            if (e) {
                res.status(500).jsonp({ error: e })
            }
            else {
                User.updateUserAcesso(req.body.username)
                res.status(201).jsonp({ token: token })
            }
        }
    );
})

router.delete('/:id', autenticacao.verificaAcesso, function (req, res) {
    User.deleteUser(req.params.id)
        .then(dados => {
            res.jsonp(dados)
        })
        .catch(erro => {
            res.status(500).jsonp(erro)
        })
})

router.put('/users/:username', autenticacao.verificaAcesso, function (req, res) {
    var token = req.query.token
    var username = jwt.decode(token).username
    if(req.params.username === username && req.body.nome){
        User.updateNome(req.params.username, req.body.nome)
            .then(dados => {
                res.jsonp(dados)
            })
            .catch(erro => {
                res.status(409).jsonp({ error: erro }) 
    })
    } else {
        res.status(400).jsonp({ error: 'missing username, or unathorized acess' })
    }
});

module.exports = router;