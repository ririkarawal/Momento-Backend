const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createUpload, getUpload, getUserUploads, updateUpload, deleteUpload } = require('../controllers/uploadController');

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Routes
router.post('/create', upload.single('image'), createUpload);
router.get('/view_uploads', getUpload);
router.get('/user/:userId', getUserUploads);
router.put('/update/:id', updateUpload);
router.delete('/delete/:id', deleteUpload);

module.exports = router;