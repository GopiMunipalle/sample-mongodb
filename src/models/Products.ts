import { Schema, model } from "mongoose";

const pointSchema = new Schema(
  {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  { _id: false }
);

type productT = {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: [];
  location: {
    type: string;
    coordinates: [number, number];
  };
};

const productSchema = new Schema<productT>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    rating: {
      type: [],
      required: false,
    },
    location: {
      type: pointSchema,
      index: "2dsphere",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const productModel = model<productT>("Products", productSchema);
export default productModel;
