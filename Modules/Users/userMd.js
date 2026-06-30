const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "fullname is required"],
      default: "",
    },
    phoneNumber: {
      type: String,
      match: [/^(?:\+98|0)?9\d{9}$/, "invalid Phone number"],
      required: [true, "phoneNumber is required"],
      unique: [true, "this phoneNumber already exist"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "superAdmin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    password: {
      type: String,
      required: [true, "password is required"],
      unique: [true, "this password is already exist"],
    },
    addressId: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
      default: [],
    },
    favoriteProductsId: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
      default: [],
    },
  },

  { timestamps: true, versionKey: false },
);

const User = mongoose.model("User", userSchema);
export default User;
