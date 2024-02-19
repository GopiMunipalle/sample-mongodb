"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = __importDefault(require("../middleware/middleware"));
const billingController_1 = __importDefault(require("../controllers/billingController"));
const billingRouter = (0, express_1.Router)();
billingRouter.post("/addAddress", middleware_1.default, billingController_1.default.addBilling);
billingRouter.get("/getAddress", middleware_1.default, billingController_1.default.getAddress);
exports.default = billingRouter;
