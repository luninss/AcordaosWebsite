var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var passport = require('passport')
var userModel = require('../models/users')
var autenticacao = require('../verifyAcess/acess')

var User = require('../controllers/users')


router.get('/:id', autenticacao.verificaAcesso, function (req, res) {
    if(req.params.id === req.idUser){
        User.getUser(req.params.id)
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

router.post('/login', passport.authenticate('local') , async function (req, res) {
    var user = await User.getUser(req.body.username)
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
                //User.updateUserLastAc cess(req.user._id)
                res.status(201).jsonp({ token: token })
            }
        }
    );
})

router.put('/:id', autenticacao.verificaAcesso, function (req, res) {
    if(req.idUser === req.params.id){
        User.updateUser(req.params.id, req.body)
            .then(dados => {
                res.jsonp(dados)
            })
            .catch(erro => {
                res.status(409).jsonp({ error: erro }) 
            })
    }else
        res.status(403).jsonp({error: `${req.user.username} não tem permissões para aceder a esta informação.`})
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
    if (req.body.password) {
        User.updateUserPassword(req.params.username, req.body.password)
            .then(dados => {
                res.jsonp(dados)
            })
            .catch(erro => {
                res.status(409).jsonp({ error: erro }) 
            })
    } else {
        res.status(400).jsonp({ error: 'missing password' })
    }
});

module.exports = router;