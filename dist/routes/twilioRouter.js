"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const twilioController_1 = __importDefault(require("../controllers/twilioController"));
const express_1 = __importDefault(require("express"));
const twilioRouter = express_1.default.Router();
twilioRouter.post("/sendOtp", twilioController_1.default.sendSms);
twilioRouter.post("/verify", twilioController_1.default.verifySms);
exports.default = twilioRouter;
