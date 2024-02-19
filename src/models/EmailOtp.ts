import { Schema, model } from "mongoose";

type emailT = {
  email: string;
  otp: string;
  createdAt: Date;
};

const otpSchema = new Schema<emailT>({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

const EmailOtp = model<emailT>("EmailOtp", otpSchema);
export default EmailOtp;
