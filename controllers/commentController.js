const Comment = require('../model/CommentModel')
const User = require('../model/UserModel');

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
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
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
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        await comment.destroy();
        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        console.error("Error deleting comment:", err);
        res.status(500).json({ error: err.message });
    }
}

module.exports = {createComment, getComment, deleteComment, updateComment}