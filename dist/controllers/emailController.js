"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = require("dotenv");
const User_1 = __importDefault(require("../models/User"));
const EmailOtp_1 = __importDefault(require("../models/EmailOtp"));
(0, dotenv_1.config)();
const transport = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
    },
});
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const otp = Math.floor(100000 + Math.random() * 600000).toString();
        const date = new Date().getTime();
        const user = yield User_1.default.findOne({ email: email });
        if (!user) {
            return res.status(404).send({ error: "Invalid Email" });
        }
        const existingUser = yield EmailOtp_1.default.findOne({ email: email });
        if (!existingUser) {
            const newOtp = new EmailOtp_1.default({
                email: email,
                otp: otp,
                createdAt: date,
            });
            yield newOtp.save();
        }
        else {
            existingUser.otp = otp;
            existingUser.createdAt = new Date(date);
            yield existingUser.save();
        }
        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: email,
            subject: "Email Verification",
            text: `your email otp is ${otp}`,
        };
        const info = yield transport.sendMail(mailOptions);
        res.status(200).send({ message: "Otp sent successfully", info });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        const user = yield EmailOtp_1.default.findOne({ email });
        if (!user) {
            return res.status(404).send({ error: "invalid email" });
        }
        const currentTime = new Date().getTime();
        console.log(user);
        const expirationTime = user.createdAt.getTime() + 1 * 60 * 1000;
        console.log("expt", expirationTime);
        console.log("cut", currentTime);
        if (currentTime <= expirationTime) {
            const checkOtp = yield EmailOtp_1.default.findOne({ otp });
            if (!checkOtp) {
                return res.status(401).send({ error: "otp not matched" });
            }
            return res.status(200).send({ message: "otp verification successfull" });
        }
        return res.status(400).send({ error: "Otp timed Out" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.default = { sendOtp, verifyOtp };
