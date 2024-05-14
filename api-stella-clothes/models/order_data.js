const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderDataSchema = new mongoose.Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    reference: "Order",
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    reference: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  priceAtTime: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    enum: ["XS", "S", "M", "L", "XL"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, { versionKey: false});

const OrderData = mongoose.model("OrderData", orderDataSchema);

module.exports = OrderData;