import { Schema, model } from "mongoose";

type employeT = {
  name: string;
  age: Number;
  gender: string;
  occupation: string;
};

const employeSchema = new Schema<employeT>({
  name: {
    type: String,
    requied: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
});

const employeModel = model<employeT>("Employe", employeSchema);

export default employeModel;
