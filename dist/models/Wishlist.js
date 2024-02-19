"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const wishlistSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    movies: {
        type: [{ type: mongoose_1.Types.ObjectId, ref: "Movies" }],
    },
}, { versionKey: false, timestamps: true });
const wishlistModel = (0, mongoose_1.model)("Wishlist", wishlistSchema);
exports.default = wishlistModel;
