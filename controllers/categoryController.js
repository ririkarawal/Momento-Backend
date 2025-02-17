const Category = require('../model/CategoryModel')

const getCategory = async(req, res)=>{

    try{
        const tests = await Category.findAll();
        res.status(200).json(tests);

    }
    catch(error){
        res.status(500).json({error: "Failed to Load"})
    }
}

const createCategory = async(req, res)=>{
    
    try{
        
const {id,categoryName} = req.body;

//Hash the password
const newtest = await User.create({id,categoryName})

res.status(200).json(newtest);
    }
    catch(error){
        res.status(500).json({error: "Failed to Load"})
        console.log(error)
    }

}

const updateCategory = async(req, res)=>{
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await category.update(req.body);
        res.json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const deleteCategory = async(req, res)=>{
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await category.destroy();
        res.json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {createCategory, getCategory, deleteCategory, updateCategory}