const Upload = require('../model/UploadModel');
const User = require('../model/UserModel');
const fs = require('fs');
const path = require('path');

// Create a new upload
const createUpload = async (req, res) => {
    console.log("Full request body:", req.body);
    console.log("File received:", req.file ? req.file : "No file");

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        // Validate user
        const userId = req.body.userId;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Create upload record
        const newUpload = await Upload.create({
            description: req.body.description || '',
            isLiked: req.body.isLiked === "true",
            userId: userId,
            imagePath: req.file.filename // Store just the filename
        });

        // Fetch the created upload with user details
        const uploadWithUser = await Upload.findByPk(newUpload.id, {
            include: [{
                model: User,
                attributes: ['id', 'username']
            }]
        });

        // Log the created upload
        console.log("Created upload:", uploadWithUser.toJSON());

        res.status(200).json(uploadWithUser);
    } catch (error) {
        console.error("Error in createUpload:", error);
        
        // If file was uploaded but record creation failed, remove the file
        if (req.file) {
            const filePath = path.join(__dirname, '../uploads', req.file.filename);
            try {
                fs.unlinkSync(filePath);
            } catch (unlinkError) {
                console.error("Failed to remove uploaded file:", unlinkError);
            }
        }

        res.status(500).json({ 
            error: "Failed to upload",
            details: error.message 
        });
    }
};

// Get all uploads
const getUpload = async (req, res) => {
    try {
        console.log("Starting to fetch all uploads...");
        const uploads = await Upload.findAll({
            include: [{
                model: User,
                as: 'User',
                attributes: ['id', 'username']
            }],
            order: [['createdAt', 'DESC']]
        });
        
        console.log("Uploads fetched successfully:", uploads.length);
        res.status(200).json(uploads);
    } catch (error) {
        console.error("Error in getUpload:", {
            message: error.message,
            stack: error.stack
        });
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
        console.log("Finding uploads for userId:", userId);

        // Verify user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch user's uploads
        const uploads = await Upload.findAll({
            where: { userId: userId },
            include: [{
                model: User,
                as: 'User',
                attributes: ['id', 'username']
            }],
            order: [['createdAt', 'DESC']]
        });

        console.log(`Found ${uploads.length} uploads for user ${userId}`);
        res.status(200).json(uploads);
    } catch (error) {
        console.error("Error in getUserUploads:", {
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
    createUpload,
    getUpload,
    getUserUploads,
    updateUpload,
    deleteUpload
};