import mongoose, { Schema, Document, Types } from 'mongoose';

export interface CartItem {
  productId: string;
  quantity: number;
  size: string;
}

export interface ICart extends Document {
  userId: Types.ObjectId;
  items: CartItem[];
}

const CartItemSchema: Schema = new Schema({
  productId: {
    type: String,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  size: {
    type: String,
    required: true,
  },
}, { _id: false });

const CartSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [CartItemSchema],
}, { timestamps: true });

export default mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);
