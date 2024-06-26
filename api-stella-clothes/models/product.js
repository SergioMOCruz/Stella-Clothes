const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL'],
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      reference: 'Category',
      required: true,
    },
    image: {
      type: String,
      //required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
