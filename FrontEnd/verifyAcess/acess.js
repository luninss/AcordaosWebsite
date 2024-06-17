var jwt = require('jsonwebtoken')

module.exports.verificaAcesso = function (req, res, next) {
	var myToken = req.cookies.token
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
		console.log('sem token')
		res.redirect('/login')
	}
}

module.exports.verificaAdmin = function (req, res, next) {
	var myToken = req.cookies.token
	if (myToken) {
		jwt.verify(myToken, "PROJETO-EW", function (e, payload) {
			if (e) {
				res.status(401).jsonp({ error: e })
			}
			else {
				if(payload.level === 'admin'){
					next()
				}else{
					console.log(payload.level)
					console.log('Rota restritaa.');
					res.status(403).jsonp({error: 'Rota restrita.'})
				}
			}
		})
	}
	else {
		res.redirect('/login')
	}
}