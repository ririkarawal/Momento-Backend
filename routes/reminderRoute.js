
const express = require('express')

const router = express.Router();

const reminderController = require('../controllers/reminderController')

router.get('/view_reminder',reminderController.getReminder)
router.post('/create_reminder',reminderController.createReminder)
router.put('/update_reminder/:id',reminderController.updateReminder)
router.delete('/delete_reminder/:id',reminderController.deleteReminder)

module.exports = router;