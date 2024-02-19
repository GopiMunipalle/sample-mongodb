"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const db_1 = __importDefault(require("./db"));
const router_1 = __importDefault(require("./routes/router"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const file_1 = __importDefault(require("./files/file"));
const streamifier_1 = __importDefault(require("streamifier"));
const UserFile_1 = __importDefault(require("./models/UserFile"));
const cloudinary_1 = require("cloudinary");
const emaiRouter_1 = __importDefault(require("./routes/emaiRouter"));
const twilioRouter_1 = __importDefault(require("./routes/twilioRouter"));
const wishlistRouter_1 = __importDefault(require("./routes/wishlistRouter"));
const productsRouter_1 = __importDefault(require("./routes/productsRouter"));
const billingRouter_1 = __importDefault(require("./routes/billingRouter"));
const app = (0, express_1.default)();
(0, dotenv_1.config)();
const port = process.env.PORT || "4004";
app.use(express_1.default.json());
app.use("/emp", router_1.default);
app.use("/user", userRoute_1.default);
app.use("/email", emaiRouter_1.default);
app.use("/twilio", twilioRouter_1.default);
app.use("/wishlist", wishlistRouter_1.default);
app.use("/products", productsRouter_1.default);
app.use("/billing", billingRouter_1.default);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.post("/single", file_1.default.array("file", 3), (req, res) => {
    try {
        // console.log(req.body, req.file);
        const files = req.files;
        if (!req.files || files.length === 0) {
            return res.status(404).send({ error: "No file provided" });
        }
        const uploadPromises = files.map((file) => {
            return new Promise((resolve, reject) => {
                const stream_to_cloud_pipe = cloudinary_1.v2.uploader.upload_stream({ folder: "mongoose" }, (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    console.log(error, result);
                    const userFile = new UserFile_1.default({
                        filename: result === null || result === void 0 ? void 0 : result.original_filename,
                        url: result === null || result === void 0 ? void 0 : result.secure_url,
                    });
                    userFile.save();
                    resolve(userFile);
                });
                streamifier_1.default.createReadStream(file.buffer).pipe(stream_to_cloud_pipe);
            });
        });
        Promise.all(uploadPromises)
            .then(() => {
            res.status(200).json({ message: "Files uploaded successfully" });
        })
            .catch((error) => {
            console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
        });
        // res.status(200).send({ message: "file uploaded successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
app.post("/multy-form", file_1.default.array("files", 4), (req, res) => {
    try {
        console.log(req.body, req.files);
        res.status(200).send({ message: "files uploaded successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "internal server error" });
    }
});
(0, db_1.default)()
    .then(() => {
    app.listen(port, () => {
        console.log(`server running at http://localhost:${port}`);
    });
})
    .catch((error) => {
    console.log("error connecting to db", error);
});
