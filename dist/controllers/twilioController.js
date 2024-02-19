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
const Twilio_1 = __importDefault(require("../models/Twilio"));
const User_1 = __importDefault(require("../models/User"));
const twilio_1 = __importDefault(require("twilio"));
const auth_token = process.env.AUTH_TOKEN;
const account_id = process.env.ACCOUNT_SID;
const twilio_num = process.env.TWILIO_NUM;
const client = (0, twilio_1.default)(account_id, auth_token);
const sendSms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { number } = req.body;
        const otp = Math.floor(100000 + Math.random() * 600000).toString();
        const time = new Date().getTime();
        const user = yield User_1.default.findOne({ number: number });
        if (!user) {
            return res.status(404).send({ error: "User not registered" });
        }
        const existedNumber = yield Twilio_1.default.findOne({ number });
        if (!existedNumber) {
            const newSmsUser = new Twilio_1.default({
                number,
                otp,
                createdAt: time,
            });
            yield newSmsUser.save();
        }
        else {
            existedNumber.otp = otp;
            existedNumber.createdAt = new Date(time);
            yield existedNumber.save();
        }
        const messageOptions = yield client.messages.create({
            from: twilio_num,
            to: `${"+"}${91}${number}`,
            body: `OTP Verification: ${otp}`,
        });
        return res
            .status(200)
            .send({ message: "OTP sent successfully", messageOptions });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
const verifySms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { number, otp } = req.body;
        const user = yield Twilio_1.default.findOne({ number });
        if (!user) {
            return res.status(404).send({ error: "user not valid" });
        }
        const expirationTime = (user === null || user === void 0 ? void 0 : user.createdAt.getTime()) + 1 * 60 * 1000;
        const currentTime = new Date().getTime();
        if (currentTime <= expirationTime) {
            const verify = yield Twilio_1.default.findOne({ otp });
            if (!verify) {
                return res.status(404).send({ error: "Invalid Otp" });
            }
            return res.status(200).send({ message: "OTP Verification Successfull" });
        }
        return res.status(401).send({ error: "OTP Time Out" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.default = { sendSms, verifySms };
