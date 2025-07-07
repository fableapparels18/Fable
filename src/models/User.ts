import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name.'],
  },
  email: { 
    type: String, 
    required: [true, 'Please provide an email.'], 
    unique: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address']
  },
  password: { 
    type: String, 
    required: [true, 'Please provide a password.'],
    select: false 
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
