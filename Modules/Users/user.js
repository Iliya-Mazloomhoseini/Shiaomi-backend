import { Router } from "express";
import { getAllUserValidator } from "./UserValidator.js";
import isAdmin from "../../MiddleWare/isAdmin.js";
import { changePassword, Create, getAll, getOne, update } from "./userCn.js";
import isLogin from "../../MiddleWare/isLogin.js";
import {
  changePasswordValidator,
  updateUserValidator,
  userIdParam,
} from "./UserValidator";
import { handleValidationErrors } from "../../Utils/handleValidationError.js";

const userRouter = Router();

userRouter
  .route("/")
  .get(getAllUserValidator, isAdmin, handleValidationErrors, getAll)
  .create(isAdmin, Create);

userRouter
  .route("/change")
  .patch(
    isLogin,
    changePasswordValidator,
    handleValidationErrors,
    changePassword,
  );

userRouter
  .route("/:id")
  .patch(isLogin, updateUserValidator, handleValidationErrors, update)
  .get(isLogin, userIdParam, handleValidationErrors, getOne);


  export default userRouter