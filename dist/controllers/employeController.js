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
const Employe_1 = __importDefault(require("../models/Employe"));
const addEmploye = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, age, gender, occupation } = req.body;
        if (!name && !age && !gender && !occupation) {
            return res.status(400).send({ error: "Missing Required Field" });
        }
        const employe = new Employe_1.default({
            name,
            age,
            gender,
            occupation,
        });
        yield employe.save();
        res.status(200).send({ message: "Employee added" });
        // const data = await employeModel.createIndex({name:1});
        // res.send(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.default = { addEmploye };
