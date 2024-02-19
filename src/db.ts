import { connect } from "mongoose";

export default async function connectDb() {
  try {
    const url: string | undefined = process.env.MONGOOSE_URI;

    if (!url) {
      console.warn("Warning: DBURL environment variable is not defined.");
    }

    const connInstance = await connect(url as string);
    console.log("Connected to MongoDB");

    return "Connected Successfully";
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
}
