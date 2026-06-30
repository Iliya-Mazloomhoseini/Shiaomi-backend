import { Router } from "express";
import isAdmin from "../../MiddleWare/isAdmin.js";
import isLogin from "../../MiddleWare/isLogin.js";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";
import {
  categoryIdParam,
  createCategoryValidator,
  getAllCategoryValidator,
  updateCategoryValidator,
} from "./CategoryValidator.js";
import { Create, getAll, getOne, remove, update } from "./categoryCn.js";

const categoryRouter = Router();

categoryRouter
  .route("/")
  .get(getAllCategoryValidator, handleValidationErrors, getAll)
  .create(isAdmin, createCategoryValidator, handleValidationErrors, Create);
categoryRouter
  .route("/:id")
  .patch(isAdmin, updateCategoryValidator, handleValidationErrors, update)
  .get(isLogin, categoryIdParam, handleValidationErrors, getOne)
  .delete(isAdmin, remove);
export default categoryRouter;
