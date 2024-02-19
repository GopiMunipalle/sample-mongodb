"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: false,
    },
    wishlist: {
        type: [{ type: mongoose_1.Types.ObjectId, ref: "Wishlist" }],
    },
    cart: {
        type: [{ type: mongoose_1.Types.ObjectId, ref: "Cart" }],
    },
    billing: {
        type: [{ type: mongoose_1.Types.ObjectId, ref: "Billing" }],
        required: false,
    },
}, { versionKey: false, timestamps: true });
const userModel = (0, mongoose_1.model)("User", userSchema);
exports.default = userModel;
