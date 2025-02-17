
const express = require('express')

const router = express.Router();

const userController = require('../controllers/uploadController')

router.get('/view_users',userController.getUser)
router.post('/create_users',userController.createUser)
router.put('/update_users/:id',userController.updateUser)
router.delete('/delete_users/:id',userController.deleteUser)

module.exports = router;