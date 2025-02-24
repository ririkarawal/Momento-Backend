const Upload = require('../model/UploadModel');
const User = require('../model/UserModel');

const fs = require('fs');
const path = require('path');

const getUploadsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        console.log("Finding uploads for category:", categoryId);

        const uploads = await Upload.findAll({
            where: { categoryId: categoryId },
            include: [{
                model: User,
                as: 'User',
                attributes: ['id', 'username']
            }],
            order: [['createdAt', 'DESC']]
        });

        console.log(`Found ${uploads.length} uploads for category ${categoryId}`);

        res.status(200).json(uploads);
    } catch (error) {
        console.error("Error in getUploadsByCategory:", {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({
            error: "Failed to load category uploads",
            details: error.message
        });
    }
};


// Create  upload
const createUpload = async (req, res) => {
    console.log("Full upload request:", {
        body: req.body,
        file: req.file
    });

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        // Detailed file information logging
        console.log('File details:', {
            originalName: req.file.originalname,
            filename: req.file.filename,
            path: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size
        });

        const newUpload = await Upload.create({
            description: req.body.description || '',
            isLiked: false,
            userId: req.body.userId,
            categoryId: req.body.categoryId || null, // Add this line
            imagePath: req.file.filename
        });

        // Log created upload details
        console.log('Created Upload:', newUpload.toJSON());

        res.status(200).json(newUpload);
    } catch (error) {
        console.error("Comprehensive Upload Error:", {
            message: error.message,
            stack: error.stack,
            body: req.body,
            file: req.file
        });

        res.status(500).json({ 
            error: "Failed to upload",
            details: error.message 
        });
    }
};



// Get all uploads
const getUpload = async (req, res) => {
    try {
        // Make sure you've imported Category model at the top of the file
        const Category = require('../model/CategoryModel');
        
        const uploads = await Upload.findAll({
            include: [
                {
                    model: User,
                    as: 'User',
                    attributes: ['id', 'username']
                },
                {
                    model: Category,
                    as: 'Category',
                    attributes: ['id', 'categoryName']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        
        res.status(200).json(uploads);
    } catch (error) {
        console.error("Error in getUpload:", error);
        res.status(500).json({
            error: "Failed to load uploads",
            details: error.message
        });
    }
};

// Get uploads for a specific user
const getUserUploads = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log("Finding uploads for specific userId:", userId);

        const uploads = await Upload.findAll({
            where: { userId: userId },
            include: [{
                model: User,
                as: 'User',
                attributes: ['id', 'username']
            }],
            order: [['createdAt', 'DESC']]
        });

        console.log("Uploads Found:", uploads.map(upload => ({
            id: upload.id,
            imagePath: upload.imagePath,
            userId: upload.userId,
            description: upload.description
        })));

        res.status(200).json(uploads);
    } catch (error) {
        console.error("Detailed Error in getUserUploads:", {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({
            error: "Failed to load user uploads",
            details: error.message
        });
    }
};

// Update an upload
const updateUpload = async (req, res) => {
    try {
        const upload = await Upload.findByPk(req.params.id);
        if (!upload) {
            return res.status(404).json({ message: 'Upload not found' });
        }

        // Update with validation
        const updateData = {};
        if (req.body.description) updateData.description = req.body.description;
        if (req.body.isLiked !== undefined) updateData.isLiked = req.body.isLiked;

        const updatedUpload = await upload.update(updateData);
        
        res.json(updatedUpload);
    } catch (error) {
        console.error("Error in updateUpload:", error);
        res.status(400).json({ 
            error: "Failed to update upload",
            details: error.message 
        });
    }
};

// Delete an upload
const deleteUpload = async (req, res) => {
    try {
        const upload = await Upload.findByPk(req.params.id);
        if (!upload) {
            return res.status(404).json({ message: 'Upload not found' });
        }

        // Optionally, delete the physical file
        const filePath = path.join(__dirname, '../uploads', upload.imagePath);
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (fileDeleteError) {
            console.error("Failed to delete file:", fileDeleteError);
        }

        // Delete the upload record
        await upload.destroy();
        res.json({ message: 'Upload deleted successfully' });
    } catch (error) {
        console.error("Error in deleteUpload:", error);
        res.status(500).json({ 
            error: "Failed to delete upload",
            details: error.message 
        });
    }
};

module.exports = {
    getUploadsByCategory,
    createUpload,
    getUpload,
    getUserUploads,
    updateUpload,
    deleteUpload
};