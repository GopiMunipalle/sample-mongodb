import twilioController from "../controllers/twilioController";
import express from "express";
const twilioRouter = express.Router();

twilioRouter.post("/sendOtp", twilioController.sendSms);
twilioRouter.post("/verify", twilioController.verifySms);

export default twilioRouter;
