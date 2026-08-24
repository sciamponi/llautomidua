// Plain TS mirrors of the Prisma enums.
// @prisma/client is CommonJS, so named enum imports break under Vite SSR
// ("Named export 'AuthScope' not found"). These const objects are safe to
// import from both server and client code.

export const ProductType = {
  SAAS: "SAAS",
  SERVICE: "SERVICE",
  SOLUTION: "SOLUTION",
  MEDIA: "MEDIA",
} as const;
export type ProductType = (typeof ProductType)[keyof typeof ProductType];

export const LeadType = {
  GENERAL: "GENERAL",
  DEMO: "DEMO",
  QUOTE: "QUOTE",
  SCREEN_INSTALLATION: "SCREEN_INSTALLATION",
  SCREEN_ADVERTISING: "SCREEN_ADVERTISING",
  PARTNER: "PARTNER",
  SPECIALIST_CLICK: "SPECIALIST_CLICK",
} as const;
export type LeadType = (typeof LeadType)[keyof typeof LeadType];

export const DemoAccessStatus = {
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  REVOKED: "REVOKED",
} as const;
export type DemoAccessStatus =
  (typeof DemoAccessStatus)[keyof typeof DemoAccessStatus];

export const RevenueType = {
  SUBSCRIPTION: "SUBSCRIPTION",
  ONE_TIME: "ONE_TIME",
  RECURRING_SERVICE: "RECURRING_SERVICE",
  MEDIA: "MEDIA",
} as const;
export type RevenueType = (typeof RevenueType)[keyof typeof RevenueType];

export const AuthScope = {
  GLOBAL: "GLOBAL",
  PRODUCT: "PRODUCT",
  COMPANY: "COMPANY",
  PARTNER: "PARTNER",
} as const;
export type AuthScope = (typeof AuthScope)[keyof typeof AuthScope];

export const UserRole = {
  MASTER_ADMIN: "MASTER_ADMIN",
  ADMIN: "ADMIN",
  OPERATOR: "OPERATOR",
  CUSTOMER: "CUSTOMER",
  PARTNER: "PARTNER",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const SiteOrderStatus = {
  SUBMITTED: "SUBMITTED",
  DATA_REVIEW: "DATA_REVIEW",
  IN_PRODUCTION: "IN_PRODUCTION",
  WAITING_APPROVAL: "WAITING_APPROVAL",
  CHANGES_REQUESTED: "CHANGES_REQUESTED",
  APPROVED: "APPROVED",
  PUBLISHED: "PUBLISHED",
  CANCELLED: "CANCELLED",
} as const;
export type SiteOrderStatus =
  (typeof SiteOrderStatus)[keyof typeof SiteOrderStatus];

export const SiteOrderVersionStatus = {
  DRAFT: "DRAFT",
  WAITING_APPROVAL: "WAITING_APPROVAL",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  ARCHIVED: "ARCHIVED",
} as const;
export type SiteOrderVersionStatus =
  (typeof SiteOrderVersionStatus)[keyof typeof SiteOrderVersionStatus];

export const ApprovalRequestStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  CHANGES_REQUESTED: "CHANGES_REQUESTED",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
} as const;
export type ApprovalRequestStatus =
  (typeof ApprovalRequestStatus)[keyof typeof ApprovalRequestStatus];

export const NotificationStatus = {
  PENDING: "PENDING",
  SENT: "SENT",
  FAILED: "FAILED",
  SIMULATED: "SIMULATED",
} as const;
export type NotificationStatus =
  (typeof NotificationStatus)[keyof typeof NotificationStatus];

export const PaymentMethod = {
  PIX: "PIX",
  CREDIT_CARD: "CREDIT_CARD",
  BOLETO: "BOLETO",
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const PaymentStatus = {
  PENDING: "PENDING",
  PROOF_SUBMITTED: "PROOF_SUBMITTED",
  UNDER_REVIEW: "UNDER_REVIEW",
  PAID: "PAID",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
  FAILED: "FAILED",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
