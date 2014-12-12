var express = require('express');
var router = express.Router();
var mock = require('../data/mockPersons');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'observable validation test' });
});

router.get('/getpersons', function (req, res) {
  res.json(mock);
});

module.exports = router;
