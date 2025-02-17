
const express = require('express')

const router = express.Router();

const uploadController = require('../controllers/uploadController')

router.get('/view_uploads',uploadController.getUpload)
router.post('/create_uploads',uploadController.createUpload)
router.put('/update_uploads/:id',uploadController.updateUpload)
router.delete('/delete_uploads/:id',uploadController.deleteUpload)

module.exports = router;