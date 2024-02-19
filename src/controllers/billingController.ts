import userModel from "../models/User";
import billingModel from "../models/Billing";
import { RequestWithUser } from "../middleware/customTypes";
import { Response } from "express";
import productModel from "../models/Products";

const addBilling = async (req: RequestWithUser, res: Response) => {
  try {
    const userEmail = req.email;
    const user = await userModel.findOne({ email: userEmail });
    const userId = user?._id;
    const {
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
      latitude,
      longitude,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !country ||
      !streetAddress ||
      !town ||
      !province ||
      !zipcode ||
      !phone ||
      !email ||
      !longitude ||
      !latitude
    ) {
      return res.status(400).send({ error: "Enter Required Fields" });
    }

    const location = {
      longitude: longitude,
      latitude: latitude,
    };

    const newBilling = new billingModel({
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
      location,
    });

    await newBilling.save();

    res.status(200).send({ message: "Billing Added Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const getAddress = async (req: RequestWithUser, res: Response) => {
  try {
    const userEmail = req.email;
    const user = await userModel.findOne({ email: userEmail });
    const userId = user?._id;
    const address = await billingModel.findOne({ userId: userId });
    if (!address) {
      return res.status(404).send({ error: "User have no Address" });
    }
    const allAddresses = await billingModel.find({ userId: userId });
    // console.log(allAddresses);
    res.status(200).send({ adresses: allAddresses });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const getLocation = async (req: RequestWithUser, res: Response) => {
  try {
    const location = await productModel.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [78.23432, 17.342523],
          },
          $maxDistance: 50000,
          $minDistance: 500,
        },
      },
    });
    res.send(location);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export default { addBilling, getAddress, getLocation };
