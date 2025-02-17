const CategoryUpload = require('../model/CategoryUploadModel')

const getCategoryUpload = async(req, res)=>{

    try{
        const tests = await CategoryUpload.findAll();
        res.status(200).json(tests);

    }
    catch(error){
        res.status(500).json({error: "Failed to Load"})
    }
}

const createCategoryUpload = async(req, res)=>{
    
    try{
        
const {Categoryid,Uploadid} = req.body;

//Hash the password
const newtest = await User.create({Categoryid,Uploadid})

res.status(200).json(newtest);
    }
    catch(error){
        res.status(500).json({error: "Failed to Load"})
        console.log(error)
    }

}

const updateCategoryUpload = async(req, res)=>{
    try {
        const categoryUpload = await CategoryUpload.findByPk(req.params.id);
        if (!categoryUpload) {
            return res.status(404).json({ message: 'CategoryUpload not found' });
        }
        await categoryUpload.update(req.body);
        res.json(categoryUpload);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const deleteCategoryUpload = async(req, res)=>{
    try {
        const categoryUpload = await CategoryUpload.findByPk(req.params.id);
        if (!categoryUpload) {
            return res.status(404).json({ message: 'CategoryUpload not found' });
        }
        await categoryUpload.destroy();
        res.json({ message: 'CategoryUpload deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {createCategoryUpload, getCategoryUpload, deleteCategoryUpload, updateCategoryUpload}