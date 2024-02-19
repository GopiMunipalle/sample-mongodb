"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const upload = (0, multer_1.default)();
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     return cb(null, "./src/uploads");
//   },
//   filename: function (req, file, cb) {
//     console.log("Uploading File:", file.originalname);
//     return cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
// const upload = multer({ storage });
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_APISECRET_KEY,
});
exports.default = upload;
