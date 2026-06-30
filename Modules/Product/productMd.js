import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true, versionKey: false },
);
const Product = mongoose.model("Product", productSchema);
export default Product;
