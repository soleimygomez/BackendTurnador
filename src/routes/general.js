//Requires
const express = require('express');
const { body } = require('express-validator'); 

//Initialize
const router = express.Router();

//Controllers
const { verifyToken } = require('../controllers/validator');
const general_controller = require('../controllers/general');


//****************************************************** */
//****************************************************** */
//Usuario
router.post('/User/Create', general_controller.createUser);
router.get('/User/All', general_controller.AllUser);

//****************************************************** */
//****************************************************** */
//codigo Qr
router.get('/User/Qr',general_controller.withOutSession);
// router.get('/QR',general_controller.getQr);
//****************************************************** */
//****************************************************** */
//login
router.post('/Account/Token', [body('email', 'Email inválido').exists().isEmail(),
body('password', "La contraseña es incorrecta123").exists(),], general_controller.makeLogin); 

//****************************************************** */
//****************************************************** */
//comentario
router.post('/Comment/CreateComment', general_controller.createComment);
router.get('/Comment/AllComment', general_controller.AllComment);
router.put('/Comment/EditarComment', general_controller.EdithComment);
router.delete('/Comment/EliminarComment', general_controller.EliminarComment);
//****************************************************** */
//****************************************************** */
//message
router.put('/Message/EditarMessage', general_controller.EdithMessage);
router.put('/Message/EditarMessageStatus', general_controller.EdithMessageStatus);
router.get('/Message/AllMessage', general_controller.AllMessage);
router.get('/Message/AllMessageByAsesora', general_controller.AllMessageUser);
router.get('/Message/userInformation',general_controller.userInformation);
router.get('/Message/Downoload',general_controller.Downoload)
//*************************************************************** */
//*************************************************************** */

 


//Export
module.exports = router;
