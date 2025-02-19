const Reminder = require('../model/ReminderModel')

const getReminder = async(req, res)=>{

    try{
        const tests = await Reminder.findAll();
        res.status(200).json(tests);

    }
    catch(error){
        res.status(500).json({error: "Failed to Load"})
    }
}

const createReminder = async(req, res)=>{
    
    try{
        
const {message,UserId} = req.body;

//Hash the password
const newtest = await User.create({message,UserId})

res.status(200).json(newtest);
    }
    catch(error){
        res.status(500).json({error: "Failed to Load"})
        console.log(error)
    }

}

const updateReminder= async(req, res)=>{
    try {
        const reminder = await Reminder.findByPk(req.params.id);
        if (!reminder) {
            return res.status(404).json({ message: 'Reminder not found' });
        }
        await reminder.update(req.body);
        res.json(reminder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const deleteReminder = async(req, res)=>{
    try {
        const reminder = await User.findByPk(req.params.id);
        if (!reminder) {
            return res.status(404).json({ message: 'Reminder not found' });
        }
        await reminder.destroy();
        res.json({ message: 'Reminder deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {createReminder, getReminder, deleteReminder, updateReminder}