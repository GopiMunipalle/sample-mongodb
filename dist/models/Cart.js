"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const cartShema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
    },
    products: {
        type: [{ type: mongoose_1.Types.ObjectId, ref: "Products" }],
        required: false,
    },
}, { versionKey: false, timestamps: true });
const cartModel = (0, mongoose_1.model)("Cart", cartShema);
exports.default = cartModel;
