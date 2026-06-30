const { default: mongoose } = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    title: {
      required: [true, "title is required"],
      unique: [true, "a category with this title is already exist"],
      type: String,
      index: true,
    },
    image: {
      required: [true, "title is required"],
      type: String,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true, versionKey: false },
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
