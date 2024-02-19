import express from "express";
import productsController from "../controllers/productsController";
import middleware from "../middleware/middleware";
const productRouter = express.Router();

productRouter.get("/fetch-products", productsController.products);
productRouter.post("/addProduct", middleware, productsController.addProduct);
productRouter.get(
  "/cartlist/:cartId",
  middleware,
  productsController.getCartList
);
productRouter.get("/allProducts", productsController.getAllProducts);
productRouter.get("/singleProduct/:id", productsController.getSingleProduct);
productRouter.get("/getCategory", productsController.getCategoty);
productRouter.get("/pagination", productsController.pagination);

export default productRouter;
