// use server'

/**
 * @fileOverview Generates a slogan for the FableFront brand.
 *
 * - generateSlogan - A function that generates a slogan.
 * - GenerateSloganInput - The input type for the generateSlogan function.
 * - GenerateSloganOutput - The return type for the generateSlogan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSloganInputSchema = z.object({
  brandName: z.string().describe('The name of the brand.'),
});

export type GenerateSloganInput = z.infer<typeof GenerateSloganInputSchema>;

const GenerateSloganOutputSchema = z.object({
  slogan: z.string().describe('The generated slogan for the brand.'),
});

export type GenerateSloganOutput = z.infer<typeof GenerateSloganOutputSchema>;

export async function generateSlogan(input: GenerateSloganInput): Promise<GenerateSloganOutput> {
  return generateSloganFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSloganPrompt',
  input: {schema: GenerateSloganInputSchema},
  output: {schema: GenerateSloganOutputSchema},
  prompt: `You are a marketing expert specializing in creating catchy slogans for clothing brands.

  Generate a slogan for the brand: {{{brandName}}}.
  The slogan should be short, memorable, and relevant to the brand's target audience.
  The brand sells T-shirts in the following categories: Oversized, Hoodie, Full Sleeves, Half Sleeves, Sweatshirt.
  The brand focuses on black and white themes and modern, dynamic designs.
  `,
});

const generateSloganFlow = ai.defineFlow(
  {
    name: 'generateSloganFlow',
    inputSchema: GenerateSloganInputSchema,
    outputSchema: GenerateSloganOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
