const { User } = require("../models/User");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
const secret = uuidv4();

const handleGetallUser = async (req, resp) => {
    try {
        const usersList = await User.find({});
        return resp.json(usersList);
    } catch (err) {
        console.error('Error occurred:', err);
        return resp.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const handleCreateUser = async (req, resp) => {
    try {
        const { first_name, last_name, email, role, password, confirm_password } = req.body;
        if(role == 'admin') {
            return resp.status(400).json({ success: false, message: 'You cannot create admin user.' });
        }
        if (!first_name || !email || !password) {
            return resp.status(400).json({ success: false, message: 'Kindly fill all the required inputs' });
        }
        if (password !== confirm_password) {
            return resp.status(400).json({ success: false, message: 'Password and confirm password must be the same.' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return resp.status(500).json({ success: false, message: 'Email already in exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await User.create({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            is_active: true,
            role: role || 'customer'
        });
        const newUserObject = newUser.toObject();
        delete newUserObject.password;
        const token = setUser(newUserObject);
        return resp.status(201).json({ success: true, message: 'User added successfully', user: newUserObject, token });
    } catch (err) {
        console.error('Error occurred:', err);
        return resp.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const handleLogin = async (req, resp) => {
    try {
        console.log(req.body);
        let { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return resp.status(400).json({success: false, message: "User not found" });
        }
        console.log(user.password, password);
        // Check if the password matches the hashed password in the database
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return resp.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const newUserObject = user.toObject();
        delete newUserObject.password;
        const token = setUser(newUserObject);
        return resp.status(201).json({success: true, message : "Logged in successfully.", "user" : newUserObject, token});
    } catch (err) {
        console.error('Error occurred:', err);
        return resp.status(500).json({ success: false, 'message':'Something went wrong'});
    }
}

const handleDeleteUser = async (req, resp) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) {
            return resp.status(404).json({ success: false, message: "User not found" });
        }
        if(user.role == 'superAdmin') {
            return resp.status(400).json({ success: false, message: "Something went wrong" });
        }
        await User.delete({ _id: id }); 
        return resp.json({status: 200, message: "User deleted successfully"});
    } catch (err) {
        console.error('Error occurred:', err);
        return resp.status(500).json({ success: false, message:'Something went wrong'});
    }
}

const getCurrentUser = async (req, resp) => {
    try {
        const user_id = req.params?.id;
        if (!user_id) {
            return resp.status(400).json({ success: false, message: "User ID is required" });
        }
        let user = jwt.verify(user_id, secret);
        if(user) {
            return resp.json({success: true, user});
        } else {
            return resp.status(404).json({success: false, message: "User not found"});
        }
    } catch (err) {
        console.error('Error occurred in getting user:', err);
        return resp.status(500).json({ success: false, 'message':'Unable to fetch user'});
    }
}

const setUser = (user) => {
    return jwt.sign(user, secret, { expiresIn: '5m' });
}

module.exports = {
    handleGetallUser, handleCreateUser, handleLogin, handleDeleteUser, getCurrentUser
}