import { Schema, Types, model } from "mongoose";

type wishlistT = {
  title: string;
  description: string;
  movies: { _id: string }[];
};

const wishlistSchema = new Schema<wishlistT>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    movies: {
      type: [{ type: Types.ObjectId, ref: "Movies" }],
    },
  },
  { versionKey: false, timestamps: true }
);

const wishlistModel = model<wishlistT>("Wishlist", wishlistSchema);

export default wishlistModel;
