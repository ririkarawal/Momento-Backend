const express = require('express');
const router = express.Router();
const pinController = require('../controllers/pinController');
const auth = require('../middleware/auth');

// Debug route to check if the endpoint is accessible
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'Pin routes are working' });
});

// Get all pins for logged-in user
router.get('/view_pin', auth, pinController.getPin);

// Get pins for a specific user
router.get('/user/:userId', auth, pinController.getUserPins);

// Create a new pin
router.post('/create_pin', auth, pinController.createPin);

// Delete a pin
router.delete('/delete_pin/:id', auth, pinController.deletePin);

module.exports = router;