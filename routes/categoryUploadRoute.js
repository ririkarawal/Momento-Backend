
const express = require('express')

const router = express.Router();

const categoryUploadController = require('../controllers/categoryUploadController')

router.get('/view_categoryUpload',categoryUploadController.getCategoryUpload)
router.post('/create_categoryUpload',categoryUploadController.createCategoryUpload)
router.put('/update_categoryUpload/:id',categoryUploadController.updateCategoryUpload)
router.delete('/delete_categoryUpload/:id',categoryUploadController.deleteCategoryUpload)

module.exports = router;