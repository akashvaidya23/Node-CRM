const { User } = require("../models/User");
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
        const { first_name, last_name, email, password, confirm_password } = req.body;
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
        });
        return resp.status(201).json({ success: true, message: 'User added successfully', user_id: newUser._id });
    } catch (err) {
        console.error('Error occurred:', err);
        return resp.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const handleLogin = async (req, resp) => {
    try {
        let { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return resp.status(400).json({success: false, message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return resp.status(400).json({ success: false, message: "Invalid credentials" });
        }
        return resp.status(201).json({success: true, message : "Logged in successfully.", "user_id" : user.id});
    } catch (err) {
        console.error('Error occurred:', err);
        return resp.status(500).json({ success: false, 'message':'Something went wrong'});
    }
}

const handleDeleteUser = async (req, resp) => {
    try {
        const id = req.params.id;
        console.log(id);
        await User.delete({ _id: id }); 
        return resp.json({status: 200, message: "User deleted successfully"});
    } catch (err) {
        console.error('Error occurred:', err);
        return resp.status(500).json({ success: false, 'message':'Something went wrong'});
    }
}

module.exports = {
    handleGetallUser, handleCreateUser, handleLogin, handleDeleteUser
}