const express = require('express')

const router = express.Router();

const commentController = require('../controllers/commentController')

router.get('/view_comment',commentController.getComment)
router.post('/create_comment',commentController.createComment)
router.put('/update_comment/:id',commentController.updateComment)
router.delete('/delete_comment/:id',commentController.deleteComment)

module.exports = router;