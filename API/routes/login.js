const jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();
// Removed unused imports
// var users = require('../controllers/users');
// var auth = require('../auth/auth');

// Endpoint to generate a token
router.post('/', (req, res) => {
  const user = { id: 3 }; // Example user
  const token = jwt.sign({ user }, 'PROJETO-EW', { expiresIn: '1h' });
  res.json({ token });
});

// Middleware to verify token
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const token = bearerHeader.split(' ')[1];
    jwt.verify(token, 'PROJETO-EW', (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        req.user = authData;
        next();
      }
    });
  } else {
    res.sendStatus(403);
  }
}

// Protected route
router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Protected route accessed!', user: req.user });
});

module.exports = router;
