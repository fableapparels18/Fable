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
