import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
config();

const upload = multer();
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

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_APISECRET_KEY,
});

export default upload;
