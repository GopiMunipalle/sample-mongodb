import { Schema, model } from "mongoose";

type billingT = {
  userId: string;
  firstName: string;
  lastName: string;
  companyName: string;
  country: string;
  streetAddress: string;
  town: string;
  province: string;
  zipcode: number;
  phone: number;
  email: string;
  location: { longitude: string; latitude: string };
};

const billingSchema = new Schema<billingT>(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: true,
    },
    streetAddress: {
      type: String,
      required: true,
    },
    town: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    zipcode: {
      type: Number,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    location: {
      longitude: String,
      latitude: String,
    },
  },
  { versionKey: false, timestamps: true }
);

const billingModel = model<billingT>("Billing", billingSchema);

export default billingModel;
