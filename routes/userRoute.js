
const express = require('express')

const router = express.Router();

const userController = require('../controllers/userController')
const auth = require("../middleware/auth");


router.post('/login', userController.loginUser);
router.post('/signup', userController.registerUser);

router.get('/view_users',auth,userController.getUser)
// router.get('/:id',userController.getUserById)
router.get("/getUsersById",auth, userController.getUserById);
router.post('/create_users',auth,userController.createUser)
router.put('/update_users/:id',auth,userController.updateUser)
router.delete('/delete_users/:id',auth,userController.deleteUser)

module.exports = router;