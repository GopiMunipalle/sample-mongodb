import userController from "../controllers/userController";
import express from "express";
const userRouter = express.Router();

userRouter.post("/singUp", userController.singUp);
userRouter.post("/login", userController.login);

export default userRouter;
