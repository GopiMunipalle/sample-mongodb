import userModel from "../models/User";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const singUp = async (req: Request, res: Response) => {
  const { email, password, number } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  if (!email && !password) {
    return res.status(404).send({ error: "Invalid data" });
  }

  const user = await userModel.findOne({ email: email });
  if (user) {
    res.status(400).send({ error: "email Already Exists" });
  }

  const newUesr = new userModel({
    email,
    password: hashedPassword,
    number,
  });
  await newUesr.save();
  res.status(200).send({ message: "User Added Successfully" });
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      return res.status(400).send({ error: "Invalid Data" });
    }
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).send({ error: "Email not Exists" });
    }
    const isCheckPassword = await bcrypt.compare(password, user.password);
    if (!isCheckPassword) {
      return res.status(404).send({ error: "Invalid Password" });
    }
    const payload = { email: email };
    const jwtToken = await jwt.sign(payload, "secret_key", {
      expiresIn: "30d",
    });
    res.status(200).send({ jwtToken: jwtToken });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export default { singUp, login };
