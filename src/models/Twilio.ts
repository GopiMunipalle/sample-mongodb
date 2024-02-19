import { Schema, model } from "mongoose";

type twilioT = {
  number: string;
  otp: string;
  createdAt: Date;
};

const twilioSchema = new Schema<twilioT>({
  number: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: false,
  },
});

const twilioModel = model<twilioT>("Twilio", twilioSchema);
export default twilioModel;
