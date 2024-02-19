"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const employeController_1 = __importDefault(require("../controllers/employeController"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post("/add", employeController_1.default.addEmploye);
exports.default = router;
