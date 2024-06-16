var jwt = require('jsonwebtoken')

module.exports.verificaAcesso = function (req, res, next) {
	var myToken = req.query.token || req.body.token
	if (myToken) {
		jwt.verify(myToken, "PROJETO-EW", function (e, payload) {
			if (e) {
				res.status(401).jsonp({ error: e })
			}
			else {
				req.idUser = payload._id
				req.isAdmin = payload.level === 'admin'
				next()
			}
		})
	}
	else {
		res.status(401).jsonp({ error: "Este token não existe" })
	}
}

module.exports.verificaAdmin = function (req, res, next) {
	var myToken = req.query.token || req.body.token
	if (myToken) {
		jwt.verify(myToken, "PROJETO-EW", function (e, payload) {
			if (e) {
				res.status(401).jsonp({ error: e })
			}
			else {
				if(payload.level === 'admin'){
					next()
				}else{
					res.status(403).jsonp({error: 'Rota restrita.'})
				}
			}
		})
	}
	else {
		res.status(401).jsonp({ error: "Este token não existe" })
	}
}