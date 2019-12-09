var express = require('express');
var router = express.Router();

const ctrlUser = require('../controller/user.controller');
const jwtHelper = require('../config/jwtHelper');

router.post('/register', ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.get('/userProfile',jwtHelper.verifyJwtToken, ctrlUser.userProfile);

router.get('/userProfiles',jwtHelper.verifyJwtToken, ctrlUser.userProfiles);
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

module.exports = router;
