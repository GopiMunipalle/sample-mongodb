import { Schema, model } from "mongoose";

type fileT = {
  filename: string;
  url: string;
};

const fileSchema = new Schema<fileT>({
  filename: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const fileModel = model<fileT>("UserFile", fileSchema);
export default fileModel;
