var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Mudiaga Otojareri' });
});

router.get('/home', function(req, res, next) {
  res.render('home', { title: 'Mudiaga Otojareri' });
});

/* GET login. */
router.get('/login', function(req, res, next) {
  res.render('Login', { title: 'login' });
});

/* GET about me page. */
router.get('/aboutme', function(req, res, next) {
  res.render('about', { title: 'About Me' });
});


/* GET the services i offer. */
router.get('/services', function(req, res, next) {
  res.render('services', { title: 'Services' });
});

/* GET my contact details. */
router.get('/contactme', function(req, res, next) {
  res.render('contactme', { title: 'Contact Me' });
});

module.exports = router;
