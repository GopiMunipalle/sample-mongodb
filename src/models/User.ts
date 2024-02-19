import { Schema, Types, model } from "mongoose";

type userT = {
  email: string;
  password: string;
  number: string;
  wishlist: { title: string; _id: string }[];
  cart: { _id: string }[];
  billing: { _id: string }[];
};

const userSchema = new Schema<userT>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: false,
    },
    wishlist: {
      type: [{ type: Types.ObjectId, ref: "Wishlist" }],
    },
    cart: {
      type: [{ type: Types.ObjectId, ref: "Cart" }],
    },
    billing: {
      type: [{ type: Types.ObjectId, ref: "Billing" }],
      required: false,
    },
  },
  { versionKey: false, timestamps: true }
);

const userModel = model<userT>("User", userSchema);

export default userModel;
