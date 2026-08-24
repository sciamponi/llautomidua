import { z } from 'zod';

export const ProductType = z.enum(['SAAS', 'SERVICE', 'SOLUTION', 'MEDIA']);
export type ProductType = z.infer<typeof ProductType>;

export const LeadType = z.enum([
  'GENERAL',
  'DEMO',
  'QUOTE',
  'SCREEN_INSTALLATION',
  'SCREEN_ADVERTISING',
  'PARTNER',
]);
export type LeadType = z.infer<typeof LeadType>;

export const RevenueType = z.enum([
  'SUBSCRIPTION',
  'ONE_TIME',
  'RECURRING_SERVICE',
  'MEDIA',
]);
export type RevenueType = z.infer<typeof RevenueType>;

export interface Product {
  id: string;
  name: string;
  slug: string;
  type: ProductType;
  category: string;
  segment: string;
  subcategory?: string | null;
  shortDescription: string;
  description: string;
  audience?: string | null;
  problem?: string | null;
  solution?: string | null;
  features?: any;
  pricingType: RevenueType;
  pricing?: string | null;
  ctaType?: string | null;
  demoUrl?: string | null;
  landingUrl?: string | null;
  whatsappMessage?: string | null;
  status: string;
  featured: boolean;
  sortOrder: number;
}
