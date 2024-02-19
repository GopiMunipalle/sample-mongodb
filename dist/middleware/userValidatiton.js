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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let jwtToken = null;
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            res.status(404).send({ error: "Invalid token data" });
        }
        jwtToken = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split("")[1];
        if (!jwtToken) {
            return res.status(401).send({ error: "Invalid jwt token" });
        }
        yield jsonwebtoken_1.default.verify(jwtToken, "secret_key", (error, payload) => {
            if (error || !payload) {
                return res.status(404).send({ error: "Invalid access token" });
            }
            req.email = payload.email;
            next();
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.default = userValidation;
