import { z } from "zod";

export const ProductType = z.enum(["SAAS", "SERVICE", "SOLUTION", "MEDIA"]);
export type ProductType = z.infer<typeof ProductType>;

export const LeadType = z.enum([
  "GENERAL",
  "DEMO",
  "QUOTE",
  "SCREEN_INSTALLATION",
  "SCREEN_ADVERTISING",
  "PARTNER",
  "SITE_ORDER",
  "MEDIA_INDOOR",
]);
export type LeadType = z.infer<typeof LeadType>;

export const LeadStatus = z.enum([
  "NOVO",
  "CONTATO_INICIADO",
  "EM_ATENDIMENTO",
  "CONVERTIDO",
  "PERDIDO",
]);
export type LeadStatus = z.infer<typeof LeadStatus>;

export const RevenueType = z.enum(["SUBSCRIPTION", "ONE_TIME", "RECURRING_SERVICE", "MEDIA"]);
export type RevenueType = z.infer<typeof RevenueType>;

export const CampaignStatus = z.enum(["DRAFT", "ACTIVE", "PAUSED", "ENDED"]);
export type CampaignStatus = z.infer<typeof CampaignStatus>;

export const AdStatus = z.enum(["ACTIVE", "INACTIVE"]);
export type AdStatus = z.infer<typeof AdStatus>;

export const ScreenStatus = z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"]);
export type ScreenStatus = z.infer<typeof ScreenStatus>;

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

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Campaign {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  companyId: string;
  company?: Company;
  imageUrl?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  status: CampaignStatus;
  ctaText?: string | null;
  captureUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Screen {
  id: string;
  name: string;
  identifier: string;
  location?: string | null;
  establishment?: string | null;
  status: ScreenStatus;
  lastActiveAt?: Date | null;
  currentCampaignId?: string | null;
  companyId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ad {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  ctaText?: string | null;
  campaignId: string;
  screenId?: string | null;
  duration?: number | null;
  priority: number;
  status: AdStatus;
  createdAt: Date;
  updatedAt: Date;
}
