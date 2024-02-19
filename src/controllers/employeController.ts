import { Request, Response } from "express";
import employeModel from "../models/Employe";

const addEmploye = async (req: Request, res: Response) => {
  try {
    const { name, age, gender, occupation } = req.body;
    if (!name && !age && !gender && !occupation) {
      return res.status(400).send({ error: "Missing Required Field" });
    }
    const employe = new employeModel({
      name,
      age,
      gender,
      occupation,
    });
    await employe.save();
    res.status(200).send({ message: "Employee added" });
    // const data = await employeModel.createIndex({name:1});
    // res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export default { addEmploye };
