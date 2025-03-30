const { Mongoose } = require("mongoose");
const mongooseDelete = require('mongoose-delete');

const ProductSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
},{ timestamps: true }
);

Product.plugin(mongooseDelete, { 
    overrideMethods: 'all',
    deletedAt: true 
});

// model
const Product = Mongoose.model("Product", ProductSchema);

module.exports = Product;