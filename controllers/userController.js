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

        // Hash the password before saving
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: hashPassword,
            isAdmin: isAdmin || false // Default to false if not specified
        });

        // Generate JWT token
        const token = jwt.sign({
            id: newUser.id,
            username: newUser.username,
            isAdmin: newUser.isAdmin
        }, process.env.JWT_SECRET, { expiresIn: "720h" });

        // Respond with user details and token
        res.status(201).json({
            message: "Registration Successful",
            token,
            userId: newUser.id,
            username: newUser.username,
            isAdmin: newUser.isAdmin
        });
    } catch (error) {
        console.error("  Registration Error:", error);
        res.status(500).json({ error: "Something went wrong." });
    }
};

// Login an existing user
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

        const token = jwt.sign({
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin
        }, process.env.JWT_SECRET, { expiresIn: "24h" });

        res.status(200).json({
            token,
            user: {
                id: user.id,
                username: user.username,
                isAdmin: user.isAdmin
            },
            message: "Login Successful"
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Something went wrong." });
    }
};




const getUser = async (req, res) => {

    try {
        const tests = await User.findAll();
        res.status(200).json(tests);

    }
    catch (error) {
        res.status(500).json({ error: "Failed to Load" })
    }
}

const createUser = async (req, res) => {

    try {

        const { username, password } = req.body;

        //Hash the password
        const newtest = await User.create({ username, password })

        res.status(200).json(newtest);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to Load" })
        console.log(error)
    }

}

const updateUser = async (req, res) => {
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

const getCurrentUser = async (req, res) => {
    try {
        // req.user is set by the auth middleware
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        // Find the user by ID from the token
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'username', 'email', 'isAdmin'] // Only return safe fields
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error getting current user:", error);
        res.status(500).json({ error: "Server error" });
    }
};


const deleteUser = async (req, res) => {
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

module.exports = { createUser, getUser, deleteUser, updateUser, loginUser, registerUser, getCurrentUser,getUserById }