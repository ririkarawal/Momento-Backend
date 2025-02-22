const User = require('../model/UserModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require("dotenv").config();



const registerUser = async (req, res) => {
    const { username, email, password, isAdmin } = req.body;
    console.log("📥 Incoming Registration Request:", { username, email, isAdmin });

    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ 
            username, 
            email, 
            password: hashPassword, 
            isAdmin: isAdmin || false // Default to false if not specified
        });

        //    Ensure isAdmin is included in JWT token
        const token = jwt.sign({ 
            id: newUser.id, 
            username: newUser.username, 
            isAdmin: newUser.isAdmin 
        }, process.env.JWT_SECRET, { expiresIn: "720h" });

        res.status(201).json({ 
            message: "Registration Successful", 
            token,
            isAdmin: newUser.isAdmin,
            username: newUser.username 
        });
    } catch (error) {
        console.error("  Registration Error:", error);
        res.status(500).json({ error: "Something went wrong." });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect password" });
        }

        //    Ensure isAdmin is included in JWT token
        const token = jwt.sign({
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin 
        }, process.env.JWT_SECRET, { expiresIn: "24h" });

        res.status(200).json({
           token,
           user:{
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin,
            message: "Login Successful"
           } 
        });
    } catch (error) {
        console.error("  Login Error:", error);
        res.status(500).json({ error: "Something went wrong." });
    }
};
// Register a new user
// const registerUser = async (req, res) => {
//     const { username, password } = req.body;

//     // Validate input
//     if (!username || !password) {
//         return res.status(400).json({ error: 'Username and password are required' });
//     }

//     try {
//         // Check if the username already exists
//         const existingUser = await User.findOne({ where: { username } });
//         if (existingUser) {
//             return res.status(400).json({ error: 'Username already exists' });
//         }

//         // Hash the password
//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(password, saltRounds);

//         // Create the user
//         const newUser = await User.create({ email,username, password: hashedPassword });

//         res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to register user' });
//     }
// };


// // Login an existing user
// const loginUser = async (req, res) => {
//     const { username, password } = req.body;

//     // Validate input
//     if (!username || !password) {
//         return res.status(400).json({ error: 'Username and password are required' });
//     }

//     try {
//         // Find the user by username
//         const user = await User.findOne({ where: { username } });
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Verify the password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(401).json({ error: 'Invalid credentials' });
//         }

//         // Generate a JWT token
//         const token = jwt.sign(
//             { id: user.id, username: user.username },
//             process.env.JWT_SECRET || 'JKHSDKJBKJSDJSDJKBKSD345345345345',
//             { expiresIn: '24h' }
//         );

//         res.status(200).json({
//             message: 'Login successful',
//             token,
//             user: { id: user.id, username: user.username }
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to login user' });
//     }
// };




const getUser = async(req, res)=>{

    try{
        const tests = await User.findAll();
        res.status(200).json(tests);

    }
    catch(error){
        res.status(500).json({error: "Failed to Load"})
    }
}

const createUser = async(req, res)=>{
    
    try{
        
const {username, password} = req.body;

//Hash the password
const newtest = await User.create({username, password})

res.status(200).json(newtest);
    }
    catch(error){
        res.status(500).json({error: "Failed to Load"})
        console.log(error)
    }

}

const updateUser = async(req, res)=>{
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.update(req.body);
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const getUserById = async (req, res) => {
    try {
        const userId = req.body.id; 
        console.log(userId)
        if (!userId) return res.status(400).json({ message: "User ID is required" });

        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteUser = async(req, res)=>{
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.destroy();
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {createUser, getUser, deleteUser, updateUser,loginUser, registerUser, getUserById}