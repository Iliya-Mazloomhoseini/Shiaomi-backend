import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import DiscountCode from "./DiscountCodeMd.js";
import Cart from "../Cart/CartMd.js";

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(DiscountCode, req.query, req.role)
    .addManualFilters(
      req.query?.search
        ? { code: { $regex: req.query.search, $options: "i" } }
        : {},
    )
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();
  const result = await features.execute();
  console.log(result);
  return res.status(200).json(result);
});
export const getOne = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(DiscountCode, req.query, req.role)
    .addManualFilters({ _id: req.params.id })
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate({
      path: "userIdsUsed",
      select: "phoneNumber role fullName",
    });
  const result = await features.execute();
  return res.status(200).json(result);
});

export const create = catchAsync(async (req, res, next) => {
  const discountCode = await DiscountCode.create(req.body);
  return res.status(201).json({
    success: true,
    message: "discountCode created successfully",
    data: discountCode,
  });
});
export const update = catchAsync(async (req, res, next) => {
  const discountCode = await DiscountCode.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      runValidator: true,
      new: true,
    },
  );
  return res.status(201).json({
    success: true,
    message: "discountCode updated successfully",
    data: discountCode,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const discountCode = await DiscountCode.findById(req.params.id);
  if (discountCode.userIdsUsed.length > 0) {
    return next(new HandleERROR("you can't deleted this discount code", 400));
  }
  await DiscountCode.findByIdAndDelete(req.params.id);
  return res.status(201).json({
    success: true,
    message: "discountCode deleted successfully",
    data: discountCode,
  });
});

export const validateCode = (userId, totalPrice, discountCode) => {
  let error = [];
  let now=new Date()
  const userUsed = discountCode.userIdsUsed?.filter(
    (item) => item.toString() == userId,
  )?.length;
  if (!discountCode.isPublished) {
    error.push("discount code unavailable");
  }
  if (discountCode?.minPrice && totalPrice < discountCode.minPrice) {
    error.push(`min price to use this code is ${discountCode.minPrice}`);
  }
  if (discountCode?.maxPrice && totalPrice > discountCode.maxPrice) {
    error.push(`max price to use this code is ${discountCode.maxPrice}`);
  }
  if (userUsed >= discountCode.maxUsedCount) {
    error.push(`used before`);
  }
  if(now>discountCode.endDate || now<discountCode.startDate){
    error.push('unavailable in this time')
  }

  return {
    success:error.length==0?true:false,
    error,
  }
};
export const checkCode = catchAsync(async (req, res, next) => {
  const { code } = req.body;
  const { userId } = req;
  const discountCode = await DiscountCode.findOne({ code });
  if (!discountCode) {
    return next(new HandleERROR("incorrect code", 400));
  }
  const cart = await Cart.findOne({ userId });
  const validate = validateCode(
    userId,
    cart.totalPriceAfterDiscount,
    discountCode,
  );
  if(!validate.success){
    return res.status(400).json({
        ...validateCode,message:'invalid code'
    })
  }
  let finalPrice=cart.totalPriceAfterDiscount
  if(discountCode.type=='amount'){
    finalPrice-=discountCode.value
  }else{
    finalPrice=finalPrice*(1-discountCode.value/100)
  }
  return res.status(200).json({
    success:true,
    data:finalPrice
  })
});
