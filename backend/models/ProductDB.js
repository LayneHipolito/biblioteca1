const mongoose = require('mongoose');
const { Schema } = mongoose;
const Category = require('./Category');

const ProductSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
   /* category: {
      type: String,
      required: true
    }, */
  },
  { timestamps: true }
);

module.exports = Product;