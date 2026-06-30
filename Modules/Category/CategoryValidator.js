import { body, param, query } from "express-validator";
import mongoose from "mongoose";
import Category from "./categoryMd.js";

/* ---------- helpers ---------- */
const isMongoId = (value) => mongoose.Types.ObjectId.isValid(value);

/* =========================================================
   PARAMS
========================================================= */

/* ---------- category id param ---------- */
export const categoryIdParam = [
  param("id")
    .notEmpty()
    .withMessage("Category id is required")
    .bail()
    .custom(isMongoId)
    .withMessage("Invalid category id")
    .bail()
    .custom(async (value) => {
      const category = await Category.findById(value);
      if (!category) {
        throw new Error("Category not found");
      }
      return true;
    }),
];

/* =========================================================
   QUERY
========================================================= */

/* ---------- get all categories ---------- */
export const getAllCategoryValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive number"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("limit must be a positive number"),

  query("search").optional().isString().withMessage("search must be a string"),

  query("sort").optional().isString().withMessage("sort must be a string"),

  query("fields").optional().isString().withMessage("fields must be a string"),

  query("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be boolean")
    .toBoolean(),
];

/* =========================================================
   CREATE
========================================================= */

/* ---------- create category ---------- */
export const createCategoryValidator = [
  body("title")
    .exists()
    .withMessage("Category title is required")
    .bail()
    .isString()
    .withMessage("Category title must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Category title cannot be empty")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category title must be between 2 and 50 characters")
    .bail()
    .custom(async (value) => {
      const existingCategory = await Category.findOne({ title: value });
      if (existingCategory) {
        throw new Error("Category title already exists");
      }
      return true;
    }),

  body("image")
    .exists()
    .withMessage("Category image is required")
    .bail()
    .isString()
    .withMessage("Category image must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Category image cannot be empty")
    .bail()
    .matches(/\.(jpg|jpeg|png|gif|webp)$/i)
    .withMessage(
      "Image must be a valid image file (jpg, jpeg, png, gif, webp)",
    ),

  body("subCategoryId")
    .optional()
    .custom(isMongoId)
    .withMessage("Invalid subCategory id format")
    .bail()
    .custom(async (value) => {
      if (value) {
        const category = await Category.findById(value);
        if (!category) {
          throw new Error("SubCategory not found");
        }
      }
      return true;
    }),

  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be boolean")
    .toBoolean(),
];

/* =========================================================
   UPDATE
========================================================= */

/* ---------- update category ---------- */
export const updateCategoryValidator = [
  ...categoryIdParam,

  body("title")
    .optional()
    .isString()
    .withMessage("Category title must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Category title cannot be empty")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category title must be between 2 and 50 characters")
    .bail()
    .custom(async (value, { req }) => {
      const existingCategory = await Category.findOne({
        title: value,
        _id: { $ne: req.params.id },
      });
      if (existingCategory) {
        throw new Error("Category title already exists");
      }
      return true;
    }),

  body("image")
    .optional()
    .isString()
    .withMessage("Category image must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Category image cannot be empty")
    .bail()
    .matches(/\.(jpg|jpeg|png|gif|webp)$/i)
    .withMessage(
      "Image must be a valid image file (jpg, jpeg, png, gif, webp)",
    ),

  body("subCategoryId")
    .optional()
    .custom(isMongoId)
    .withMessage("Invalid subCategory id format")
    .bail()
    .custom(async (value) => {
      if (value) {
        const category = await Category.findById(value);
        if (!category) {
          throw new Error("SubCategory not found");
        }
      }
      return true;
    }),

  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be boolean")
    .toBoolean(),
];

/* =========================================================
   DELETE
========================================================= */

/* ---------- delete category ---------- */
export const deleteCategoryValidator = [
  ...categoryIdParam,

  // Check if category has products or sub-categories
  param("id").custom(async (value) => {
    const Product = mongoose.model("Product");
    const Category = mongoose.model("Category");

    // Check for products
    const products = await Product.find({ categoryId: value });
    if (products.length > 0) {
      throw new Error("Cannot delete category with associated products");
    }

    // Check for sub-categories
    const subCategories = await Category.find({ subCategoryId: value });
    if (subCategories.length > 0) {
      throw new Error("Cannot delete category with associated sub-categories");
    }

    return true;
  }),
];

/* =========================================================
   GET ONE
========================================================= */

/* ---------- get one category ---------- */
export const getOneCategoryValidator = [...categoryIdParam];
