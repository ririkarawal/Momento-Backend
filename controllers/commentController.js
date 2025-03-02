const Comment = require('../model/CommentModel')
const User = require('../model/UserModel');
const Upload = require('../model/UploadModel');

const getComment = async(req, res) => {
    try {
        const comments = await Comment.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'username']
                }
            ]
        });
        res.status(200).json(comments);
    }
    catch(error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({error: "Failed to load comments"})
    }
}

const createComment = async(req, res) => {
    try {
        const {text, uploadId} = req.body;

        // Get user ID from request (if using authentication)
        const userId = req.user?.id;

        const newComment = await Comment.create({
            text, 
            uploadId,
            userId
        });

        // Fetch the comment with user data to return
        const commentWithUser = await Comment.findByPk(newComment.id, {
            include: [
                {
                    model: User,
                    attributes: ['id', 'username']
                }
            ]
        });

        res.status(200).json(commentWithUser);
    }
    catch(error) {
        console.error("Error creating comment:", error);
        res.status(500).json({error: "Failed to create comment"})
    }
}

const updateComment = async(req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.user?.id;

        // Find the comment
        const comment = await Comment.findByPk(commentId);
        
        // Check if comment exists
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if the user is the owner of the comment
        if (comment.userId !== userId) {
            return res.status(403).json({ 
                message: 'You are not authorized to edit this comment' 
            });
        }

        // Update the comment
        await comment.update(req.body);

        // Get updated comment with user data
        const updatedComment = await Comment.findByPk(comment.id, {
            include: [
                {
                    model: User,
                    attributes: ['id', 'username']
                }
            ]
        });

        res.json(updatedComment);
    } catch (err) {
        console.error("Error updating comment:", err);
        res.status(400).json({ error: err.message });
    }
}

const deleteComment = async(req, res) => {
    try {
        console.log("Delete comment request received for ID:", req.params.id);
        console.log("User making request:", req.user);
        
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) {
            console.log("Comment not found");
            return res.status(404).json({ message: 'Comment not found' });
        }
        
        // Get the upload to check ownership
        const upload = await Upload.findByPk(comment.uploadId);
        if (!upload) {
            console.log("Associated upload not found");
            return res.status(404).json({ message: 'Associated upload not found' });
        }
        
        // Check if the user is authorized to delete this comment
        const userId = req.user?.id;
        console.log("Comment userId:", comment.userId);
        console.log("Upload userId:", upload.userId);
        console.log("Current userId:", userId);
        
        if (!userId) {
            console.log("No user ID found in request");
            return res.status(401).json({ message: 'Authentication required' });
        }
        
        // User can delete if they are:
        // 1. The comment author, OR
        // 2. The upload owner
        const isCommentAuthor = comment.userId === userId;
        const isUploadOwner = upload.userId === userId;
        
        console.log("Is comment author?", isCommentAuthor);
        console.log("Is upload owner?", isUploadOwner);
        
        if (!isCommentAuthor && !isUploadOwner) {
            console.log("User not authorized to delete this comment");
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }
        
        // Delete the comment and respond
        await comment.destroy();
        console.log("Comment deleted successfully");
        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        console.error("Error deleting comment:", err);
        res.status(500).json({ error: err.message });
    }
}

module.exports = {createComment, getComment, deleteComment, updateComment}