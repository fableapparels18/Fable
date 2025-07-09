import mongoose, { Schema, Document } from 'mongoose';

export interface Product {
    _id: string;
    name: string;
    price: number;
    category: 'Oversized' | 'Hoodie' | 'Full Sleeves' | 'Half Sleeves' | 'Sweatshirt';
    images: string[];
    sizes: string[];
    description: string;
    details: string[];
    fabricAndCare: string;
    isTrending: boolean;
    isNew: boolean;
    createdAt: string;
    updatedAt: string;
  }

export interface IProduct extends Product, Document {}

const ProductSchema: Schema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, enum: ['Oversized', 'Hoodie', 'Full Sleeves', 'Half Sleeves', 'Sweatshirt'], required: true },
  images: { type: [String], required: true },
  sizes: { type: [String], required: true },
  description: { type: String, required: true },
  details: { type: [String], required: true },
  fabricAndCare: { type: String, required: true },
  isTrending: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
}, { timestamps: true, _id: false });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
