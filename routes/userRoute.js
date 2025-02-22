
const express = require('express')

const router = express.Router();

const userController = require('../controllers/userController')
const auth = require("../middleware/auth");


router.post('/login', userController.loginUser);
router.post('/signup', userController.registerUser);

router.get('/view_users',userController.getUser)
// router.get('/:id',userController.getUserById)
router.get("/me", userController.getUserById);
router.post('/create_users',userController.createUser)
router.put('/update_users/:id',userController.updateUser)
router.delete('/delete_users/:id',userController.deleteUser)

module.exports = router;