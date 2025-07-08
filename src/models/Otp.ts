import mongoose, { Schema, Document } from 'mongoose';

export interface IOtp extends Document {
  phone: string;
  otp: string;
  expiresAt: Date;
}

const OtpSchema: Schema = new Schema({
  phone: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // This will automatically delete the document after 5 minutes
    expires: 300,
  },
});

export default mongoose.models.Otp || mongoose.model<IOtp>('Otp', OtpSchema);
