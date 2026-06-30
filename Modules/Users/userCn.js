import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import User from "./userMd.js";

export const Create = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  return res.status(200).json({
    success: true,
    message: "user created successFully",
    data: user,
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const { search = null } = req.query;
  const features = new ApiFeatures(User, req.query, req.role)
    .addManualFilters(
      search
        ? {
            phoneNumber: {
              $regex: search,
              $options: "i",
            },
          }
        : {},
    )
    .sort()
    .paginate()
    .limitFields()
    .filter()
    .populate([
      { path: "favoriteProductsId" },
      { path: "addressId" },
      { path: "cartId" },
    ]);

  const result = await features.execute();
  return res.status(201).json(result);
});

export const getOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const features = new ApiFeatures(User, req.query, req.role)
    .addManualFilters(
      req.role === "user" ? { _id: req.userId } : { _id: req.params.id },
    )
    .sort()
    .paginate()
    .limitFields()
    .filter()
    .populate([
      { path: "favoriteProductsId" },
      { path: "addressId" },
      { path: "cartId" },
    ]);

  const result = await features.execute();
  return res.status(201).json(result);
});

export const update = catchAsync(async (req, res, next) => {
  const {
    isActive = null,
    role = null,
    phoneNumber = null,
    password,
  } = req.body;
  const { id } = req.params;
  if (req.role == "user" && id != req.userId) {
    return next(
      new HandleERROR("you don't have permission to update this account", 400),
    );
  }
  const user = await User.findById(id);
  if (
    (req.role === "admin" && id != req.userId && user.role === "admin") ||
    user.role === "superAdmin"
  ) {
    new HandleERROR("you don't have permission to update this account", 400);
  }
  if (req.role != "user") {
    user.isActive = isActive = null ? user.isActive : isActive;
  }

  if (req.userId == user.id) {
    user.fullName = fullName || user?.fullName;
  }
  const newUser = await user.save();
  return res.status(201).json({
    message: "user updated successFully",
    data: newUser,
  });
});

export const changePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.userId);
  if (!user) {
    return next(new HandleERROR("user not found", 404));
  }
  if (!user.password) {
    user.password = bcryptjs.hashSync(newPassword, 10);
    await user.save();
    return res.status(200).json({
      success: true,
      message: "password set successfully",
    });
  }
  if (!oldPassword.trim() || !newPassword.trim()) {
    return next(
      new HandleERROR("oldPassword  and newPassword is required", 404),
    );
  }
  const isMatch = bcryptjs.compareSync(oldPassword, user.password);
  if (!isMatch) {
    return next(new HandleERROR("old password not valid", 404));
  }
  user.password = bcryptjs.hashSync(newPassword, 10);
  return res.status(200).json({
    success: true,
    message: "updated password  successfully",
  });
});
