import mongoose from "mongoose";
const itemSchema = new mongoose.Schema(
  {
    productId: {
      type: Object,
      required: [true, "product is required"],
    },
    productVariantId: {
      type: Object,
      required: [true, "product Variant is required"],
    },
    categoryId: {
      type: Object,
      required: [true, "category is required"],
    },
    brandId: {
      type: Object,
      required: [true, "brand is required"],
    },
    quantity: {
      type: Number,
      min: 1,
    },
  },
  { _id: false },
);
const orderSchema = new mongoose.Schema({
  items: {
    type: [itemSchema],
    required: [true, "items is required"],
  },
  totalPrice: {
    type: Number,
    required: [true, "totalPrice is required"],
  },
  totalPriceAfterDiscount: {
    type: Number,
    required: [true, "totalPriceAfterDiscount is required"],
  },
  status: {
    type: String,
    enum: ["pending", "failed", "success"],
    default: "pending",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "userId is required"],
  },
  authority: {
    type: String,
    default: "",
  },
  discountCode:{
    type:Object,
    default:null
  },
  freeShipping:{
    type:Boolean,
    default:false
  },
  address:{
    type:Object,
    required:[true,'address is required']
  },
  refId:{
    type:String,
    default:''
  }
},{timestamps:true});
const Order=mongoose.model('Order',orderSchema)
export default Order


