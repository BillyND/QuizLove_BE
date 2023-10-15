const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    status: { type: String, required: true },
    payment: { type: String, required: true },
    cart: {
      listCart: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
          quantity: { type: Number, default: 0 },
          price: { type: Number, default: 0 },
        },
      ],
      totalQty: { type: Number, default: 0, require: true },
      totalCost: { type: Number, default: 0, require: true },
    },
  },
  { timestamps: true }
);

// orderSchema.plugin(uniqueValidator);
const Order = mongoose.model("order", orderSchema);
module.exports = Order;
