const express = require('express')
const auth = require('../middleware/auth') // Import auth middleware

const router = express.Router();

const commentController = require('../controllers/commentController')

router.get('/view_comment', commentController.getComment)
router.post('/create_comment', auth, commentController.createComment) // Added auth middleware
router.put('/update_comment/:id', auth, commentController.updateComment) // Added auth middleware
router.delete('/delete_comment/:id', auth, commentController.deleteComment)



module.exports = router;