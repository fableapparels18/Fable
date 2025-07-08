import { z } from 'zod';

export const ProductFormSchema = z.object({
  name: z.string().min(3, { message: 'Product name must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce.number().min(0.01, { message: 'Price must be greater than 0.' }),
  category: z.enum(['Oversized', 'Hoodie', 'Full Sleeves', 'Half Sleeves', 'Sweatshirt']),
  sizes: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one size.',
  }),
  images: z.string().min(1, { message: 'Please provide at least one image URL.' }),
  details: z.string().min(1, { message: 'Please provide product details.' }),
  fabricAndCare: z.string().min(1, { message: 'Please provide fabric and care instructions.' }),
  isTrending: z.boolean().default(false),
  isNew: z.boolean().default(false).optional(),
});

export type ProductFormData = z.infer<typeof ProductFormSchema>;

export const FeedbackFormSchema = z.object({
  rating: z.coerce.number().min(1, "Please select a rating.").max(5),
  comment: z.string().min(10, { message: "Comment must be at least 10 characters." }).max(500, { message: "Comment must be less than 500 characters." }),
});

export type FeedbackFormData = z.infer<typeof FeedbackFormSchema>;

export const AddressFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  line1: z.string().min(5, { message: 'Street address is required.' }),
  line2: z.string().optional(),
  city: z.string().min(2, { message: 'City is required.' }),
  state: z.string().min(2, { message: 'State is required.' }),
  zip: z.string().min(5, { message: 'A valid ZIP code is required.' }),
  country: z.string().min(2, { message: 'Country is required.' }),
});

export type AddressFormData = z.infer<typeof AddressFormSchema>;
