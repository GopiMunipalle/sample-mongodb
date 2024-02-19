import { Router } from "express";
import middleware from "../middleware/middleware";
import billingController from "../controllers/billingController";
const billingRouter = Router();

billingRouter.post("/addAddress", middleware, billingController.addBilling);
billingRouter.get("/getAddress", middleware, billingController.getAddress);
billingRouter.get("/getLocation", middleware, billingController.getLocation);

export default billingRouter;
