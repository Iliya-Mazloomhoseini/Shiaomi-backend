import { catchAsync } from "vanta-api";
import Order from "../Order/OrderMd.js";

export const dashboardReport = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 100 } = req.query;
  const skip = (page - 1) * limit;

  const mostBoughtPricePipeline = [
    { $match: { status: "success" } },
    {
      $group: {
        _id: "$userId",
        totalPricePerUser: { $sum: "$totalPriceAfterDiscount" }
      }
    },
    { $sort: { totalPricePerUser: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" }
  ];

  const mostBoughtCountPipeline = [
    { $match: { status: "success" } },
    {
      $group: {
        _id: "$userId",
        boughtCount: { $sum: 1 }
      }
    },
    { $sort: { boughtCount: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" }
  ];

  const mostSoldByCategoryPipeline = [
    { $match: { status: "success" } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.categoryId._id",
        boughtCount: { $sum: "$items.quantity" }
      }
    },
    { $sort: { boughtCount: -1 } },
    { $skip: skip },
    { $limit: limit }
  ];

  const [
    mostBoughtPrice,
    mostBoughtCount,
    mostSoldByCategory
  ] = await Promise.all([
    Order.aggregate(mostBoughtPricePipeline),
    Order.aggregate(mostBoughtCountPipeline),
    Order.aggregate(mostSoldByCategoryPipeline)
  ]);

  return res.status(200).json({
    success: true,
    data: {
      mostBoughtPrice,
      mostBoughtCount,
      mostSoldByCategory
    }
  });
});
// redis