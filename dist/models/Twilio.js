"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const twilioSchema = new mongoose_1.Schema({
    number: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: false,
    },
});
const twilioModel = (0, mongoose_1.model)("Twilio", twilioSchema);
exports.default = twilioModel;
