import {
  STRIPE_BASIC_ANNUAL_PRICE_ID,
  STRIPE_BASIC_MONTHLY_PRICE_ID,
  STRIPE_PRO_ANNUAL_PRICE_ID,
  STRIPE_PRO_MONTHLY_PRICE_ID
} from '@/config/url.config';
import { StripePlan } from '@better-auth/stripe';

export const STRIPE_PLANS = [
  {
    name: 'basic',
    priceId: STRIPE_BASIC_MONTHLY_PRICE_ID,
    annualDiscountPriceId: STRIPE_BASIC_ANNUAL_PRICE_ID,
    limits: {
      project: 10,
      folder: 5
    }
  },
  {
    name: 'pro',
    priceId: STRIPE_PRO_MONTHLY_PRICE_ID,
    annualDiscountPriceId: STRIPE_PRO_ANNUAL_PRICE_ID,
    limits: {
      project: 20,
      folder: 10
    }
  }
] as const satisfies StripePlan[];

export const PLAN_TO_PRICE: Record<string, number> = {
  basic: 19,
  pro: 49
};
