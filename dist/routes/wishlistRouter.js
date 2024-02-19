"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wishlistController_1 = __importDefault(require("../controllers/wishlistController"));
const middleware_1 = __importDefault(require("../middleware/middleware"));
const express_1 = require("express");
const wishlistRouter = (0, express_1.Router)();
wishlistRouter.get("/movieList", wishlistController_1.default.Movies);
wishlistRouter.post("/addMovie", middleware_1.default, wishlistController_1.default.addMovie);
wishlistRouter.post("/addWishlist", middleware_1.default, wishlistController_1.default.addWishlist);
wishlistRouter.get("/getMovies/:wishlistId", middleware_1.default, wishlistController_1.default.getMovies);
wishlistRouter.get("/getWishlists", middleware_1.default, wishlistController_1.default.getWishlists);
wishlistRouter.delete("/delete/:wishlistId", middleware_1.default, wishlistController_1.default.deleteWishlist);
wishlistRouter.delete("/deleteMovie/:movieId", middleware_1.default, wishlistController_1.default.deleteMovie);
exports.default = wishlistRouter;
