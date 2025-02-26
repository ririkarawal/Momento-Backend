const express = require('express')
const router = express.Router();
const pinController = require('../controllers/pinController')
const auth = require('../middleware/auth')  // Authentication middleware

// Get all pins (authenticated)
router.get('/view_pin', auth, pinController.getPin)

// Create a new pin (authenticated)
router.post('/create_pin', auth, pinController.createPin)

// Delete a pin (authenticated)
router.delete('/delete_pin/:id', auth, pinController.deletePin)


module.exports = router;