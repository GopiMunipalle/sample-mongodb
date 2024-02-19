import { Schema, Types, model } from "mongoose";

type cartT = {
  userId: string;
  products: [];
};

const cartShema = new Schema<cartT>(
  {
    userId: {
      type: String,
      required: true,
    },
    products: {
      type: [{ type: Types.ObjectId, ref: "Products" }],
      required: false,
    },
  },
  { versionKey: false, timestamps: true }
);

const cartModel = model<cartT>("Cart", cartShema);

export default cartModel;
