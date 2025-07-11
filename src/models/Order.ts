import mongoose, { Schema, Document, Types } from 'mongoose';
import type { IAddress } from './User';

export interface OrderItem {
  productId: Types.ObjectId;
  name: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
}

const AddressSchema: Schema = new Schema({
    name: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
}, { _id: false });


export interface IOrder extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  shippingAddress: Omit<IAddress, '_id'>,
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema: Schema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
}, { _id: false });


const OrderSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [OrderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  shippingAddress: {
      type: AddressSchema,
      required: true,
  }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
