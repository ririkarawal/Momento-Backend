const Comment = require('../model/CoomentModel')

const getComment = async(req, res)=>{

    try{
        const tests = await Comment.findAll();
        res.status(200).json(tests);

    }
    catch(error){
        res.status(500).json({error: "Failed to Load"})
    }
}

const createComment = async(req, res)=>{
    
    try{
        
const {text, uploadId} = req.body;

//Hash the password
const newtest = await User.create({text, uploadId})

res.status(200).json(newtest);
    }
    catch(error){
        res.status(500).json({error: "Failed to Load"})
        console.log(error)
    }

}

const updateComment = async(req, res)=>{
    try {
        const comment = await Comment.findByPk(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        await comment.update(req.body);
        res.json(comment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const deleteComment = async(req, res)=>{
    try {
        const comment = await User.findByPk(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        await comment.destroy();
        res.json({ message: 'Comment deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {createComment, getComment, deleteComment, updateComment}