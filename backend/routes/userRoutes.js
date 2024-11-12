const express = require('express');
const router = express.Router();

const {  updateUser, deleteUser, loginUser, register, getUserDetails, forgetPassword, getTokenMail, finalResetPassword, getUserByName } = require('../controllers/userController');
const checkToken = require('../middleware/checkToken');

router.post('/create',register)
router.put('/update/:_id',checkToken,updateUser);
router.delete('/delete/:_id',checkToken,deleteUser);
router.post('/login',loginUser);
router.get('/getInfo',checkToken,getUserDetails);
router.post('/forget-password',forgetPassword);
router.get('/resetToken/:token',getTokenMail)
router.post('/resetToken/:token',finalResetPassword)
router.post('/searchFriend',getUserByName)

module.exports = router;