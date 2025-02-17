
const express = require('express')

const router = express.Router();

const pinController = require('../controllers/pinController')

router.get('/view_pin',pinController.getPin)
router.post('/create_pin',pinController.createPin)
router.put('/update_pin/:id',pinController.updatePin)
router.delete('/delete_pin/:id',pinController.deletePin)

module.exports = router;