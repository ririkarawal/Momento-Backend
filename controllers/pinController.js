const Pin = require('../model/PinModel');

const getPin = async(req, res)=>{

    try{
        const tests = await Pin.findAll();
        res.status(200).json(tests);

    }
    catch(error){
        res.status(500).json({error: "Failed to Load"})
    }
}

const createPin = async(req, res)=>{
    
    try{
        
const {title,UserId} = req.body;

//Hash the password
const newtest = await User.create({title,UserId})

res.status(200).json(newtest);
    }
    catch(error){
        res.status(500).json({error: "Failed to Load"})
        console.log(error)
    }

}

const updatePin = async(req, res)=>{
    try {
        const pin = await Pin.findByPk(req.params.id);
        if (!pin) {
            return res.status(404).json({ message: 'Pin not found' });
        }
        await pin.update(req.body);
        res.json(pin);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const deletePin = async(req, res)=>{
    try {
        const pin = await User.findByPk(req.params.id);
        if (!pin) {
            return res.status(404).json({ message: 'Pin not found' });
        }
        await pin.destroy();
        res.json({ message: 'Pin deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {createPin, getPin, deletePin, updatePin}