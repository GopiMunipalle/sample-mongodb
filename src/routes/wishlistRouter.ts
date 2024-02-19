import wishlistController from "../controllers/wishlistController";
import middleware from "../middleware/middleware";
import { Router } from "express";
const wishlistRouter = Router();

wishlistRouter.get("/movieList", wishlistController.Movies);
wishlistRouter.post("/addMovie", middleware, wishlistController.addMovie);
wishlistRouter.post("/addWishlist", middleware, wishlistController.addWishlist);
wishlistRouter.get(
  "/getMovies/:wishlistId",
  middleware,
  wishlistController.getMovies
);
wishlistRouter.get(
  "/getWishlists",
  middleware,
  wishlistController.getWishlists
);
wishlistRouter.delete(
  "/delete/:wishlistId",
  middleware,
  wishlistController.deleteWishlist
);
wishlistRouter.delete(
  "/deleteMovie/:movieId",
  middleware,
  wishlistController.deleteMovie
);
export default wishlistRouter;
