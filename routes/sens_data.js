var express = require('express');
var router = express.Router();

const sensData = require('../controller/sens_data.controller');
const jwtHelper = require('../config/jwtHelper');

router.post('/sensData', jwtHelper.verifyJwtToken, sensData.dataSave);
router.put('/sensData', jwtHelper.verifyJwtToken, sensData.dataUpdate);
router.get('/sensData/:id',jwtHelper.verifyJwtToken, sensData.dataGet);

router.get('/sensAllData', sensData.allDataGet);

router.delete('/sensData/:id',jwtHelper.verifyJwtToken, sensData.deleteData);
router.delete('/sensAllData',jwtHelper.verifyJwtToken, sensData.deleteAllData);
module.exports = router;
