"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const billingSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: false,
    },
    country: {
        type: String,
        required: true,
    },
    streetAddress: {
        type: String,
        required: true,
    },
    town: {
        type: String,
        required: true,
    },
    province: {
        type: String,
        required: true,
    },
    zipcode: {
        type: Number,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
}, { versionKey: false, timestamps: true });
const billingModel = (0, mongoose_1.model)("Billing", billingSchema);
exports.default = billingModel;
