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
const User_1 = __importDefault(require("../models/User"));
const Billing_1 = __importDefault(require("../models/Billing"));
const addBilling = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, companyName, country, streetAddress, town, province, zipcode, phone, email, } = req.body;
        const userEmail = req.email;
        const user = yield User_1.default.findOne({ email: userEmail });
        const userId = user === null || user === void 0 ? void 0 : user._id;
        if (!firstName &&
            !lastName &&
            !country &&
            !streetAddress &&
            !town &&
            !province &&
            !zipcode &&
            !phone &&
            !email) {
            return res.status(400).send({ error: "Enter Required Fields" });
        }
        const billing = yield Billing_1.default.create({
            userId,
            firstName,
            lastName,
            companyName,
            country,
            streetAddress,
            town,
            province,
            zipcode,
            phone,
            email,
        });
        yield billing.save();
        res.status(200).send({ message: "Address Added Successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
const getAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userEmail = req.email;
        const user = yield User_1.default.findOne({ email: userEmail });
        const userId = user === null || user === void 0 ? void 0 : user._id;
        const address = yield Billing_1.default.findOne({ userId: userId });
        if (!address) {
            return res.status(404).send({ error: "User have no Address" });
        }
        const allAddresses = yield Billing_1.default.find({ userId: userId });
        // console.log(allAddresses);
        res.status(200).send({ adresses: allAddresses });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.default = { addBilling, getAddress };
