'use server';

import { getFeedbackByProductId } from '@/lib/data';
import type { IFeedback } from '@/models/Feedback';

export async function getFeedbackForProduct(productId: string): Promise<IFeedback[]> {
  const feedback = await getFeedbackByProductId(productId);
  return feedback;
}
