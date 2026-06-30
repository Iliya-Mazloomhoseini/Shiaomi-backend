import Category from "./categoryMd.js";
import fs from "fs";
import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Product from "../Product/productMd.js";
import { __direname } from "../../app.js";

export const Create = catchAsync(async (req, res, next) => {
  const category = await Category.create(req.body);
  return res.status(200).json({
    success: true,
    message: "category created successFully",
    data: user,
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Category, req.query, req.role)
    .addManualFilters(
      req.role === "admin" || req.role === "superAdmin"
        ? {}
        : { isPublished: true },
    )
    .sort()
    .paginate()
    .limitFields()
    .filter()
    .search(["title"]);

  const result = await features.execute();
  return res.status(200).json(result);
});

export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Category, req.query, req.role)
    .addManualFilters(
      req.role === "admin" || req.role === "superAdmin"
        ? { _id: req.params.id }
        : { $and: [{ isPublished: true }, { _id: req.params.id }] },
    )
    .sort()
    .paginate()
    .limitFields()
    .filter()
    .search(["title"]);

  const result = await features.execute();
  return res.status(200).json(result);
});

export const update = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  return res.status(201).json({
    success: true,
    message: "update category successFully",
    data: category,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const products = await Product.find({ categoryId: req.params.id });
  if (products.length > 0) {
    return next(
      new HandleERROR(
        "you can't remove this category because us has products",
        400,
      ),
    );
  }

  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new HandleERROR("not found category", 404));
  }

  if (
    category.image &&
    fs.existsSync(`${__direname}/Public/${category.image}`)
  ) {
    fs.unlinkSync(`${__direname}/Public/${category.image}`);
  }

  await Category.findByIdAndDelete(req.params.id);
  return res.status(200).json({
    success: true,
    message: "category deleted successFully",
  });
});
