import mongoose, { Schema, Document } from 'mongoose';

export interface Product {
    id: number;
    name: string;
    price: number;
    category: 'Oversized' | 'Hoodie' | 'Full Sleeves' | 'Half Sleeves' | 'Sweatshirt';
    image: string;
    isTrending: boolean;
    isNew: boolean;
    data_ai_hint: string;
  }

export interface IProduct extends Product, Document {}

const ProductSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, enum: ['Oversized', 'Hoodie', 'Full Sleeves', 'Half Sleeves', 'Sweatshirt'], required: true },
  image: { type: String, required: true },
  isTrending: { type: Boolean, required: true, default: false },
  isNew: { type: Boolean, required: true, default: false },
  data_ai_hint: { type: String, required: true },
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
