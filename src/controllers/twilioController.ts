import twilioModel from "../models/Twilio";
import userModel from "../models/User";
import { Request, Response } from "express";
import twilio from "twilio";

const auth_token = process.env.AUTH_TOKEN;
const account_id = process.env.ACCOUNT_SID;
const twilio_num = process.env.TWILIO_NUM;

const client = twilio(account_id, auth_token);

const sendSms = async (req: Request, res: Response) => {
  try {
    const { number } = req.body;
    const otp = Math.floor(100000 + Math.random() * 600000).toString();
    const time = new Date().getTime();

    const user = await userModel.findOne({ number: number });
    if (!user) {
      return res.status(404).send({ error: "User not registered" });
    }

    const existedNumber = await twilioModel.findOne({ number });

    if (!existedNumber) {
      const newSmsUser = new twilioModel({
        number,
        otp,
        createdAt: time,
      });
      await newSmsUser.save();
    } else {
      existedNumber.otp = otp;
      existedNumber.createdAt = new Date(time);
      await existedNumber.save();
    }

    const messageOptions = await client.messages.create({
      from: twilio_num,
      to: `${"+"}${91}${number}`,
      body: `OTP Verification: ${otp}`,
    });

    return res
      .status(200)
      .send({ message: "OTP sent successfully", messageOptions });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const verifySms = async (req: Request, res: Response) => {
  try {
    const { number, otp } = req.body;
    const user = await twilioModel.findOne({ number });
    if (!user) {
      return res.status(404).send({ error: "user not valid" });
    }
    const expirationTime = user?.createdAt.getTime() + 1 * 60 * 1000;
    const currentTime = new Date().getTime();
    if (currentTime <= expirationTime) {
      const verify = await twilioModel.findOne({ otp });
      if (!verify) {
        return res.status(404).send({ error: "Invalid Otp" });
      }
      return res.status(200).send({ message: "OTP Verification Successfull" });
    }
    return res.status(401).send({ error: "OTP Time Out" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export default { sendSms, verifySms };
