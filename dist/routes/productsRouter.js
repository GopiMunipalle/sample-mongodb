"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productsController_1 = __importDefault(require("../controllers/productsController"));
const middleware_1 = __importDefault(require("../middleware/middleware"));
const productRouter = express_1.default.Router();
productRouter.get("/fetch-products", productsController_1.default.products);
productRouter.post("/addProduct", middleware_1.default, productsController_1.default.addProduct);
productRouter.get("/cartlist/:cartId", middleware_1.default, productsController_1.default.getCartList);
exports.default = productRouter;
