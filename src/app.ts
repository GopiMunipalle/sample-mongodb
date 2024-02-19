import express from "express";
import { Request, Response } from "express";
import { config } from "dotenv";
import connectDb from "./db";
import router from "./routes/router";
import userRouter from "./routes/userRoute";
import upload from "./files/file";
import streamifier from "streamifier";
import fileModel from "./models/UserFile";
import { v2 as cloudinary } from "cloudinary";
import emailRouter from "./routes/emaiRouter";
import twilioRouter from "./routes/twilioRouter";
import wishlistRouter from "./routes/wishlistRouter";
import productRouter from "./routes/productsRouter";
import billingRouter from "./routes/billingRouter";

const app = express();
config();

const port = process.env.PORT || "4004";

app.use(express.json());
app.use("/emp", router);
app.use("/user", userRouter);
app.use("/email", emailRouter);
app.use("/twilio", twilioRouter);
app.use("/wishlist", wishlistRouter);
app.use("/products", productRouter);
app.use("/billing", billingRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/single", upload.array("file", 3), (req, res) => {
  try {
    // console.log(req.body, req.file);
    const files = req.files as Express.Multer.File[];

    if (!req.files || files.length === 0) {
      return res.status(404).send({ error: "No file provided" });
    }

    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const stream_to_cloud_pipe = cloudinary.uploader.upload_stream(
          { folder: "mongoose" },
          (error, result) => {
            if (error) {
              reject(error);
            }
            console.log(error, result);
            const userFile = new fileModel({
              filename: result?.original_filename,
              url: result?.secure_url,
            });
            userFile.save();
            resolve(userFile);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream_to_cloud_pipe);
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
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.post(
  "/multy-form",
  upload.array("files", 4),
  (req: Request, res: Response) => {
    try {
      console.log(req.body, req.files);
      res.status(200).send({ message: "files uploaded successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "internal server error" });
    }
  }
);

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`server running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("error connecting to db", error);
  });
