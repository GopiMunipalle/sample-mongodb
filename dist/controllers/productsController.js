"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Products_1 = __importDefault(require("../models/Products"));
const User_1 = __importDefault(require("../models/User"));
const Cart_1 = __importDefault(require("../models/Cart"));
const products = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = "https://fakestoreapi.com/products";
        const response = yield fetch(url);
        const data = yield response.json();
        for (let product of data) {
            const { title, price, description, category, image, rating } = product;
            const newProduct = new Products_1.default({
                title,
                price,
                description,
                category,
                image,
                rating,
            });
            yield newProduct.save();
        }
        res.status(200).send({ message: "products added successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.body;
        const userEmail = req.email;
        const user = yield User_1.default.findOne({ email: userEmail }).populate("cart");
        const userId = user === null || user === void 0 ? void 0 : user._id;
        const cart = yield Cart_1.default.findOne({ userId: userId });
        if (!cart) {
            const newCart = yield Cart_1.default.create({
                userId,
                products: [productId],
            });
            yield newCart.save();
            yield (user === null || user === void 0 ? void 0 : user.updateOne({ $push: { cart: newCart._id } }));
            yield (user === null || user === void 0 ? void 0 : user.save());
            return res.status(200).send({ message: "product Added Successfully" });
        }
        const isproductExists = cart.products.find((product) => product.equals(productId));
        if (isproductExists) {
            return res.status(400).send({ error: "Product Exists Already" });
        }
        yield cart.updateOne({ $push: { products: productId } });
        yield cart.save();
        return res
            .status(200)
            .send({ message: "Product Added to cart Successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
const getCartList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cartId } = req.params;
        const products = yield Cart_1.default
            .findOne({ _id: cartId })
            .populate("products");
        if (!products) {
            return res.status(404).send({ error: "cartlist not found" });
        }
        const product = products.products.map((each) => each);
        res.status(200).send({ product });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.default = { products, addProduct, getCartList };
