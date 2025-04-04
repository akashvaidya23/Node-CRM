const mongoose = require("mongoose");
const mongooseDelete = require('mongoose-delete');

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role : {
        type: String,
        required: true,
        enum: ['admin', 'customer', 'sales_namager', 'superAdmin'],
        default: 'customer'
    },
    password: {
        type: String,
        required: true,
    },
    is_active:{
        type: Boolean,
        default: 1
    }
}, { timestamps: true });

UserSchema.plugin(mongooseDelete, { 
    overrideMethods: 'all',
    deletedAt: true 
});

// model
const User = mongoose.model("User", UserSchema);

module.exports = { User }