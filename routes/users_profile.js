var express = require('express');
var router = express.Router();

const ctrlUser = require('../controller/user_profile.controller');
const jwtHelper = require('../config/jwtHelper');

router.post('/profile', jwtHelper.verifyJwtToken, ctrlUser.saveProfile);
router.get('/profile',jwtHelper.verifyJwtToken, ctrlUser.getProfile);
router.put('/profile',jwtHelper.verifyJwtToken, ctrlUser.updateProfile);
router.delete('/profile',jwtHelper.verifyJwtToken, ctrlUser.deleteProfile);

router.get('/profiles',jwtHelper.verifyJwtToken, ctrlUser.getProfiles);
router.get('/profile/:id',jwtHelper.verifyJwtToken, ctrlUser.getUser);

router.post('/professionData', jwtHelper.verifyJwtToken, ctrlUser.saveProfessionalData);
router.get('/professionData', jwtHelper.verifyJwtToken, ctrlUser.getProfessionalData);
router.put('/professionData', jwtHelper.verifyJwtToken, ctrlUser.updateProfessionalData);
// router.delete('/professionData', jwtHelper.verifyJwtToken, ctrlUser.updateProfessionalData);

router.post('/comments',jwtHelper.verifyJwtToken, ctrlUser.saveUserComments);
router.delete('/comments', jwtHelper.verifyJwtToken, ctrlUser.deleteUComments);
router.get('/comments', jwtHelper.verifyJwtToken, ctrlUser.getUComments);

router.delete('/profile/user',jwtHelper.verifyJwtToken, ctrlUser.deleteUser);
router.delete('/profile/users',jwtHelper.verifyJwtToken, ctrlUser.deleteUsers);

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

module.exports = router;
                    