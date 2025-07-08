import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  phone: string;
  email?: string;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name.'],
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number.'],
    unique: true,
  },
  email: { 
    type: String, 
    required: false,
    unique: true,
    sparse: true, // Allows multiple documents to have a null email, but unique if provided
    match: [/.+\@.+\..+/, 'Please enter a valid email address']
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
