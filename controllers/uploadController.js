const Upload = require('../model/UploadModel')

const getUpload = async(req, res)=>{

    try{
        const tests = await Upload.findAll();
        res.status(200).json(tests);

    }
    catch(error){
        res.status(500).json({error: "Failed to Load"})
    }
}

const createUpload = async(req, res)=>{
    
    try{
        
const {description, isLiked,UserId} = req.body;

//Hash the password
const newtest = await User.create({description, isLiked,UserId})

res.status(200).json(newtest);
    }
    catch(error){
        res.status(500).json({error: "Failed to Load"})
        console.log(error)
    }

}

const updateUpload = async(req, res)=>{
    try {
        const upload = await Upload.findByPk(req.params.id);
        if (!upload) {
            return res.status(404).json({ message: 'User not found' });
        }
        await upload.update(req.body);
        res.json(upload);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const deleteUpload = async(req, res)=>{
    try {
        const upload = await User.findByPk(req.params.id);
        if (!upload) {
            return res.status(404).json({ message: 'User not found' });
        }
        await upload.destroy();
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {createUpload, getUpload, deleteUpload, updateUpload}