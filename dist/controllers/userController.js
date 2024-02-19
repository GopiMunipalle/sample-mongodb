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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const singUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, number } = req.body;
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    if (!email && !password) {
        return res.status(404).send({ error: "Invalid data" });
    }
    const user = yield User_1.default.findOne({ email: email });
    if (user) {
        res.status(400).send({ error: "email Already Exists" });
    }
    const newUesr = new User_1.default({
        email,
        password: hashedPassword,
        number,
    });
    yield newUesr.save();
    res.status(200).send({ message: "User Added Successfully" });
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email && !password) {
            return res.status(400).send({ error: "Invalid Data" });
        }
        const user = yield User_1.default.findOne({ email: email });
        if (!user) {
            return res.status(404).send({ error: "Email not Exists" });
        }
        const isCheckPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!isCheckPassword) {
            return res.status(404).send({ error: "Invalid Password" });
        }
        const payload = { email: email };
        const jwtToken = yield jsonwebtoken_1.default.sign(payload, "secret_key", {
            expiresIn: "30d",
        });
        res.status(200).send({ jwtToken: jwtToken });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.default = { singUp, login };
