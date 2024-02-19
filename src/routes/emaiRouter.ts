import express from "express";
import emailController from "../controllers/emailController";
const emailRouter = express.Router();

emailRouter.post("/sendOtp", emailController.sendOtp);
emailRouter.post("/verify", emailController.verifyOtp);

export default emailRouter;
