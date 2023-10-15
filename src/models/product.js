const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
// const mongoose_delete = require("mongoose-delete");
mongoose.set("strictQuery", false);
const productSchema = new mongoose.Schema(
  {
    name: { type: String, require: true, unique: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    discount: { type: String },
    priceAfter: { type: String, required: true },
    images: [{ type: String, required: true }],
    brand: { type: String, required: true },
    category: { type: String, required: true },
    inventory: { type: String, required: true },
  },
  { timestamps: true }
);

productSchema.plugin(uniqueValidator);
// productSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Product = mongoose.model("product", productSchema);
module.exports = Product;
