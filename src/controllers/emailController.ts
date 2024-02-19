import nodemailer from "nodemailer";
import { Request, Response } from "express";
import { config } from "dotenv";
import userModel from "../models/User";
import EmailOtp from "../models/EmailOtp";
config();

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 600000).toString();
    const date = new Date().getTime();
    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.status(404).send({ error: "Invalid Email" });
    }
    const existingUser = await EmailOtp.findOne({ email: email });
    if (!existingUser) {
      const newOtp = new EmailOtp({
        email: email,
        otp: otp,
        createdAt: date,
      });
      await newOtp.save();
    } else {
      existingUser.otp = otp;
      existingUser.createdAt = new Date(date);

      await existingUser.save();
    }

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Email Verification",
      text: `your email otp is ${otp}`,
    };
    const info = await transport.sendMail(mailOptions);
    res.status(200).send({ message: "Otp sent successfully", info });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await EmailOtp.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: "invalid email" });
    }
    const currentTime = new Date().getTime();
    console.log(user);
    const expirationTime = user.createdAt.getTime() + 1 * 60 * 1000;
    console.log("expt", expirationTime);
    console.log("cut", currentTime);
    if (currentTime <= expirationTime) {
      const checkOtp = await EmailOtp.findOne({ otp });
      if (!checkOtp) {
        return res.status(401).send({ error: "otp not matched" });
      }
      return res.status(200).send({ message: "otp verification successfull" });
    }
    return res.status(400).send({ error: "Otp timed Out" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
export default { sendOtp, verifyOtp };
