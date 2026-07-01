export const DIRECT_URL = process.env.DIRECT_URL as string;
export const DATABASE_URL = process.env.DATABASE_URL as string;

// Fore Email Send
export const MAIL_HOST = process.env.NODEMAILER_MAIL_HOST as string;
export const MAIL_PORT = process.env.NODEMAILER_MAIL_PORT as string;
export const MAIL_SMTP_EMAIL = process.env.NODEMAILER_MAIL_SMTP_EMAIL as string;
export const MAIL_PASSWORD = process.env.NODEMAILER_MAIL_PASSWORD as string;

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;
export const NODE_ENV = process.env.NODE_ENV as string;
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME as string;

// Google OAuth Secret
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
// GitHub OAuth Secret
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID as string;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET as string;

// Backblaze B2 (Image Storage — private bucket, S3-compatible)
export const S3_ENDPOINT = process.env.S3_ENDPOINT as string;
export const S3_REGION = process.env.S3_REGION as string;
export const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID as string;
export const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY as string;
export const S3_BUCKET = process.env.S3_BUCKET as string;

// ARCJET KEY
export const ARCJET_API_KEY = process.env.ARCJET_KEY as string;

// stripe
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string;
export const STRIPE_WEBHOOK_SECRET = process.env
  .STRIPE_WEBHOOK_SECRET as string;
export const STRIPE_PUBLISHABLE_KEY = process.env
  .STRIPE_PUBLISHABLE_KEY as string;

// stripe price ids
export const STRIPE_BASIC_MONTHLY_PRICE_ID = process.env
  .STRIPE_BASIC_MONTHLY_PRICE_ID as string;
export const STRIPE_BASIC_ANNUAL_PRICE_ID = process.env
  .STRIPE_BASIC_ANNUAL_PRICE_ID as string;
export const STRIPE_PRO_MONTHLY_PRICE_ID = process.env
  .STRIPE_PRO_MONTHLY_PRICE_ID as string;
export const STRIPE_PRO_ANNUAL_PRICE_ID = process.env
  .STRIPE_PRO_ANNUAL_PRICE_ID as string;
