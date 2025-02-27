const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const followController = require('../controllers/followController');

// Followers count route
router.get('/followers-count/:userId', followController.getFollowersCount);

// Follow status route
router.get('/status/:userId', auth, followController.getFollowingStatus);

// Toggle follow route
router.post('/toggle', auth, followController.toggleFollow);

module.exports = router;