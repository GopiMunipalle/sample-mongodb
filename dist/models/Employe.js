"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const employeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        requied: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    occupation: {
        type: String,
        required: true,
    },
});
const employeModel = (0, mongoose_1.model)("Employe", employeSchema);
exports.default = employeModel;
