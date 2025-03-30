const { User } = require("../models/User");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const createAdmin = async (req, response) => {
    try {
        const hashedPassword = await bcrypt.hash("Admin@123", saltRounds);
        const superAdmin = User.find({ role: 'superAdmin' });
        if (superAdmin.length > 0) {
            return response.status(400).json({ success: false, message: 'Super admin already exists' });
        }
        const user = await User.create({
            'first_name' : 'admin',
            'email' : 'admin@gmail.com',
            'password': hashedPassword,
            'role' : "superAdmin",
            'is_active' : true,
        });
        console.log(user);
        const {password, ...userObject} = user.toObject();
        delete userObject.password;
        return response.status(201).json({ success: true, message: 'Admin added successfully', user: userObject });
    } catch (err) {
        console.error('Error occurred in creating admin:', err);
        return response.status(500).json({ success : false, message : 'Error in creating admin' });
    }
}

module.exports = {
    createAdmin
}