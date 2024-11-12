const express = require('express');
const { createPost, updatePost, getAllUserPost, getYourPost, deletePost, commentPost, likePost } = require('../controllers/postController');
const checkToken = require('../middleware/checkToken');
const router = express.Router();


router.post('/create',checkToken,createPost)
router.put('/update/:_id',checkToken,updatePost)
router.get('/getAllPost',getAllUserPost)
router.get('/getYourPost/:_id',checkToken,getYourPost)
router.delete('/delete/:_id',checkToken,deletePost)
router.post('/comment/:postId',checkToken,commentPost)
router.post('/likePost/:postId',checkToken,likePost)



module.exports = router