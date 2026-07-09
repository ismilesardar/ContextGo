import { INFINITY_NUMBER } from '@/utils/functions/misc';

export type PlanFeature = {
  id?: string;
  text: string;
  tooltip?: {
    title: string;
    cta: string;
    href: string;
  };
};

export type PlanDetails = {
  name: string;
  price: {
    monthly: number | null;
    yearly: number | null;
    ids?: string[];
  };
  limits: {
    users: number;
    workspaces: number;
    mcpIdentities: number;
    mcpApiKeys: number;
    projects: number;
    contexts: number;
    instructions: number;
    skills: number;
    promptTemplates: number;
    checklists: number;
    agentProfiles: number;
    mcpRequests: number;
    // tags: number;
    // folders: number;
    // groups: number;
    // networkInvites: number;
    // users: number;
    // ai: number;
    // api: number;
    // analyticsApi: number;
    // retention: string;
  };
  tiers?: {
    [key: number]: {
      price: {
        monthly: number | null;
        yearly: number | null;
        ids: string[];
      };
      limits: Partial<PlanDetails['limits']>;
    };
  };
  featureTitle?: string;
  features?: PlanFeature[];
};

// const LEGACY_PRO_PRICE_IDS = [
//   'price_1LodNLAlJJEpqkPVQSrt33Lc', // old monthly
//   'price_1LodNLAlJJEpqkPVRxUyCQgZ', // old yearly
//   'price_1OTcQBAlJJEpqkPViGtGEsbb', // new monthly (test)
//   'price_1OYJeBAlJJEpqkPVLjTsjX0E', // new monthly (prod)
//   'price_1OTcQBAlJJEpqkPVYlCMqdLL', // new yearly (test)
//   'price_1OYJeBAlJJEpqkPVnPGEZeb0' // new yearly (prod)
// ];

// const PRO_TIER_PRICE_IDS = {
//   2: [
//     'price_1SQtg3AlJJEpqkPVVhDSyd9u', // yearly (prod)
//     'price_1SQtg3AlJJEpqkPVNHYhTRy7', // monthly (prod)
//     'price_1SQ8hiAlJJEpqkPVIy8pfvAC', // yearly (test)
//     'price_1SQ8gwAlJJEpqkPVb78Oc9Yc' // monthly (test)
//   ]
// };

// // 2025 pricing
// const NEW_PRO_PRICE_IDS = [
//   'price_1R8XtyAlJJEpqkPV5WZ4c0jF', //  yearly
//   'price_1R8XtEAlJJEpqkPV4opVvVPq', // monthly
//   'price_1R8XxZAlJJEpqkPVqGi0wOqD', // yearly (test),
//   'price_1R7oeBAlJJEpqkPVh6q5q3h8', // monthly (test),
//   ...Object.values(PRO_TIER_PRICE_IDS).flat()
// ];

// const LEGACY_BUSINESS_PRICE_IDS = [
//   'price_1LodLoAlJJEpqkPV9rD0rlNL', // old monthly
//   'price_1LodLoAlJJEpqkPVJdwv5zrG', // oldest yearly
//   'price_1OZgmnAlJJEpqkPVOj4kV64R', // old yearly
//   'price_1OzNlmAlJJEpqkPV7s9HXNAC', // new monthly (test)
//   'price_1OzNmXAlJJEpqkPVYO89lTdx', // new yearly (test)
//   'price_1OzOFIAlJJEpqkPVJxzc9irl', // new monthly (prod)
//   'price_1OzOXMAlJJEpqkPV9ERrjjbw' // new yearly (prod)
// ];

// const BUSINESS_TIER_PRICE_IDS = {
//   2: [
//     'price_1SQtdxAlJJEpqkPV4kNkRHZr', // yearly (prod)
//     'price_1SQtdxAlJJEpqkPV7cvJTv4g', // monthly (prod)
//     'price_1SQ8iwAlJJEpqkPVEGmKd6Lg', // yearly (test)
//     'price_1SQ8iSAlJJEpqkPVQ5crmBtF' // monthly (test)
//   ]
// };

// 2025 pricing

// const ADVANCED_TIER_PRICE_IDS = {
//   2: [
//     'price_1SQtg6AlJJEpqkPVAJdrStq7', // yearly (prod)
//     'price_1SQtg6AlJJEpqkPVaZNisQdm', // monthly (prod)
//     'price_1SQ8jlAlJJEpqkPV6EanvSXl', // yearly (test)
//     'price_1SQ8jJAlJJEpqkPVIwY9QZSP' // monthly (test)
//   ],
//   3: [
//     'price_1SQtg8AlJJEpqkPVvQVU7uQ3', // yearly (prod)
//     'price_1SQtg8AlJJEpqkPV4Nks8MkS', // monthly (prod)
//     'price_1SQ8lqAlJJEpqkPVzBaioV3I', // yearly (test)
//     'price_1SQ8lOAlJJEpqkPVz2R8SRss' // monthly (test)
//   ]
// };

const PRO_PRICE_IDS = [
  // 'price_1R8XtyAlJJEpqkPV5WZ4c0jF', //  yearly
  // 'price_1R8XtEAlJJEpqkPV4opVvVPq', // monthly
  'prod_P5SZIQLfBwdz98zYLFVRe', // yearly (test),
  'prod_17RAtntpGPp2yUhcI7b4F3' // monthly (test),
];

export const BUSINESS_PRICE_IDS = [
  'prod_26NTQwUKp8Hw7JOAFcqWxo', // yearly (test),
  'prod_3ec8VHg3TLUCujcczSMKyu' // monthly (test),
];

const ADVANCED_PRICE_IDS = [
  'prod_2xge9jCvzl4qXGpugKMxaz', //  yearly
  'prod_2UYyqwc8XHYwonPXc9YuTI' // monthly
];

export const PLANS: PlanDetails[] = [
  {
    name: 'Free',
    price: {
      monthly: 0,
      yearly: 0
    },
    limits: {
      users: 0,
      workspaces: 2,
      mcpIdentities: 1,
      mcpApiKeys: 3,
      projects: 2,
      contexts: 10,
      instructions: 10,
      skills: 10,
      promptTemplates: 10,
      checklists: 10,
      agentProfiles: 10,
      mcpRequests: 5_000
    }
  },
  {
    name: 'Pro',
    price: {
      monthly: 19,
      yearly: 13,
      ids: [...PRO_PRICE_IDS]
    },
    limits: {
      users: 5,
      workspaces: 6,
      mcpIdentities: 30,
      mcpApiKeys: 10,
      projects: 5,
      contexts: 50,
      instructions: 50,
      skills: 50,
      promptTemplates: 50,
      checklists: 50,
      agentProfiles: 50,
      mcpRequests: 100_000
    },
    // tiers: {
    //   2: {
    //     price: {
    //       monthly: 60,
    //       yearly: 50,
    //       ids: PRO_TIER_PRICE_IDS[2]
    //     },
    //     limits: {
    //       links: 5_000,
    //       clicks: 150_000
    //     }
    //   }
    // },
    featureTitle: 'Everything in Free, plus:',
    features: [
      { id: 'clicks', text: '50K tracked events/mo' },
      { id: 'links', text: '1K new links/mo' },
      { id: 'retention', text: '1-year analytics retention' },
      { id: 'domains', text: '10 domains' },
      { id: 'users', text: '3 users' },
      {
        id: 'advanced',
        text: 'Advanced link features',
        tooltip: 'ADVANCED_LINK_FEATURES'
      },
      {
        id: 'ai',
        text: 'Unlimited AI credits',
        tooltip: {
          title:
            'Subject to fair use policy – you will be notified if you exceed the limit, which are high enough for frequent usage.',
          cta: 'Learn more.',
          href: 'https://dub.co/blog/introducing-dub-ai'
        }
      },
      {
        id: 'dotlink',
        text: 'Free .link domain',
        tooltip: {
          title:
            'All our paid plans come with a free .link custom domain, which helps improve click-through rates.',
          cta: 'Learn more.',
          href: 'https://dub.co/help/article/free-dot-link-domain'
        }
      },
      {
        id: 'folders',
        text: 'Link folders',
        tooltip: {
          title:
            'Organize and manage access to your links on Dub using folders.',
          cta: 'Learn more.',
          href: 'https://dub.co/help/article/link-folders'
        }
      },
      {
        id: 'deeplinks',
        text: 'Deep links',
        tooltip: {
          title:
            'Redirect users to a specific page within your mobile application using deep links.',
          cta: 'Learn more.',
          href: 'https://dub.co/docs/concepts/deep-links/quickstart'
        }
      }
    ] as PlanFeature[]
  },
  {
    name: 'Business',
    price: {
      monthly: 49,
      yearly: 39,
      ids: [...BUSINESS_PRICE_IDS]
    },
    limits: {
      users: 9,
      workspaces: 11,
      mcpIdentities: 80,
      mcpApiKeys: 15,
      projects: 10,
      contexts: 150,
      instructions: 150,
      skills: 150,
      promptTemplates: 150,
      checklists: 150,
      agentProfiles: 150,
      mcpRequests: 300_000
    },
    // tiers: {
    //   2: {
    //     price: {
    //       monthly: 180,
    //       yearly: 150,
    //       ids: BUSINESS_TIER_PRICE_IDS[2]
    //     },
    //     limits: {
    //       links: 25_000,
    //       clicks: 600_000
    //     }
    //   }
    // },
    featureTitle: 'Everything in Pro, plus:',
    features: [
      {
        id: 'clicks',
        text: '250K tracked events/mo'
      },
      {
        id: 'links',
        text: '10K new links/mo'
      },
      {
        id: 'retention',
        text: '3-year analytics retention'
      },
      {
        id: 'payouts',
        text: '$2.5K partner payouts/mo',
        tooltip: {
          title:
            'Send payouts to your partners with 1-click (or automate it completely) – all across the world.',
          cta: 'Learn more.',
          href: 'https://dub.co/help/article/partner-payouts'
        }
      },
      {
        id: 'users',
        text: '10 users'
      },
      {
        id: 'partners',
        text: 'Dub Partners',
        tooltip: {
          title: 'Use Dub Partners to manage and pay out your affiliates.',
          cta: 'Learn more.',
          href: 'https://dub.co/partners'
        }
      },
      {
        id: 'customerinsights',
        text: 'Customer insights',
        tooltip: {
          title:
            "Get real-time insights into your customers' behavior and preferences.",
          cta: 'Learn more.',
          href: 'https://dub.co/help/article/customer-insights'
        }
      },
      {
        id: 'events',
        text: 'Real-time events stream',
        tooltip: {
          title:
            'Get more data on your link clicks and QR code scans with a detailed, real-time stream of events in your workspace',
          cta: 'Learn more.',
          href: 'https://dub.co/help/article/real-time-events-stream'
        }
      },
      {
        id: 'webhooks',
        text: 'Event webhooks',
        tooltip: {
          title:
            'Get real-time notifications when a link is clicked or a QR code is scanned using webhooks.',
          cta: 'Learn more.',
          href: 'https://dub.co/docs/concepts/webhooks/introduction'
        }
      },
      {
        id: 'tests',
        text: 'A/B testing'
      }
    ] as PlanFeature[]
  },
  {
    name: 'Advanced',
    price: {
      monthly: 89,
      yearly: 79,
      ids: ADVANCED_PRICE_IDS
    },
    limits: {
      users: 15,
      workspaces: 19,
      mcpIdentities: 200,
      mcpApiKeys: 25,
      projects: 20,
      contexts: 500,
      instructions: 500,
      skills: 500,
      promptTemplates: 500,
      checklists: 500,
      agentProfiles: 500,
      mcpRequests: 500_000
    },
    // tiers: {
    //   2: {
    //     price: {
    //       monthly: 600,
    //       yearly: 500,
    //       ids: ADVANCED_TIER_PRICE_IDS[2]
    //     },
    //     limits: {
    //       links: 150_000,
    //       clicks: 2_000_000
    //     }
    //   },
    //   3: {
    //     price: {
    //       monthly: 900,
    //       yearly: 750,
    //       ids: ADVANCED_TIER_PRICE_IDS[3]
    //     },
    //     limits: {
    //       links: 300_000,
    //       clicks: 3_500_000
    //     }
    //   }
    // },
    featureTitle: 'Everything in Business, plus:',
    features: [
      {
        id: 'clicks',
        text: '1M tracked events/mo'
      },
      {
        id: 'links',
        text: '50K new links/mo'
      },
      {
        id: 'retention',
        text: '5-year analytics retention'
      },
      {
        id: 'payouts',
        text: '$15K partner payouts/mo',
        tooltip: {
          title:
            'Send payouts to your partners with 1-click (or automate it completely) – all across the world.',
          cta: 'Learn more.',
          href: 'https://dub.co/help/article/partner-payouts'
        }
      },
      {
        id: 'users',
        text: '20 users'
      },
      {
        id: 'flexiblerewards',
        text: 'Advanced reward structures',
        tooltip: {
          title:
            'Create dynamic click, lead, or sale-based rewards with country and product-specific modifiers.',
          cta: 'Learn more.',
          href: 'https://dub.co/help/article/partner-rewards'
        }
      },
      {
        id: 'embeddedreferrals',
        text: 'Embedded referral dashboard',
        tooltip: {
          title:
            'Create an embedded referral dashboard directly in your app in just a few lines of code.',
          cta: 'Learn more.',
          href: 'https://dub.co/docs/partners/embedded-referrals'
        }
      },
      {
        id: 'messages',
        text: 'Messaging center',
        tooltip: {
          title:
            'Easily communicate with your partners using our messaging center.'
        }
      },
      {
        id: 'email',
        text: 'Email campaigns',
        tooltip: {
          title:
            'Send marketing and transactional emails to your partners to increase engagement and drive conversions.',
          cta: 'Learn more.',
          href: 'https://dub.co/help/article/email-campaigns'
        }
      },
      {
        id: 'slack',
        text: 'Priority Slack support'
      }
    ] as PlanFeature[]
  },
  {
    name: 'Enterprise',
    price: {
      monthly: null,
      yearly: null
    },
    limits: {
      users: 30,
      workspaces: 50,
      mcpIdentities: INFINITY_NUMBER,
      mcpApiKeys: INFINITY_NUMBER,
      projects: INFINITY_NUMBER,
      contexts: INFINITY_NUMBER,
      instructions: INFINITY_NUMBER,
      skills: INFINITY_NUMBER,
      promptTemplates: INFINITY_NUMBER,
      checklists: INFINITY_NUMBER,
      agentProfiles: INFINITY_NUMBER,
      mcpRequests: INFINITY_NUMBER
      // links: 500_000,
      // clicks: 5_000_000,
      // payouts: INFINITY_NUMBER,
      // domains: 250,
      // tags: INFINITY_NUMBER,
      // folders: INFINITY_NUMBER,
      // groups: INFINITY_NUMBER,
      // networkInvites: 20,
      // users: 30,
      // ai: 1_000,
      // api: 3_000,
      // analyticsApi: 16,
      // retention: 'Unlimited'
    }
  }
];

export const FREE_PLAN = PLANS.find((plan) => plan.name === 'Free')!;
export const PRO_PLAN = PLANS.find((plan) => plan.name === 'Pro')!;
export const BUSINESS_PLAN = PLANS.find((plan) => plan.name === 'Business')!;
export const ADVANCED_PLAN = PLANS.find((plan) => plan.name === 'Advanced')!;
export const ENTERPRISE_PLAN = PLANS.find(
  (plan) => plan.name === 'Enterprise'
)!;

export const SELF_SERVE_PAID_PLANS = PLANS.filter((p) =>
  ['Pro', 'Business', 'Advanced'].includes(p.name)
);

export const FREE_WORKSPACES_LIMIT = 2;

const enrichPlanWithTierData = (
  planDetails: PlanDetails,
  planTier: number
): PlanDetails => {
  const tierData =
    planDetails.tiers && planTier > 1 ? planDetails.tiers[planTier] : undefined;
  const tierLimits = tierData?.limits ?? planDetails.limits;

  return {
    ...planDetails,
    limits: {
      ...planDetails.limits,
      ...tierLimits
    },
    price: {
      ...planDetails.price,
      ...tierData?.price
    }
  };
};

export const getPlanAndTierFromPriceId = ({
  priceId
}: {
  priceId: string;
}): { plan: PlanDetails | null; planTier: number } => {
  const planDetails = PLANS.find((plan) => plan.price.ids?.includes(priceId));
  if (!planDetails) return { plan: null, planTier: 1 };

  const planTier = planDetails.tiers
    ? Number(
        Object.entries(planDetails.tiers).find(([_, { price }]) =>
          price.ids.includes(priceId)
        )?.[0]
      ) || 1
    : 1;

  return {
    plan: enrichPlanWithTierData(planDetails, planTier),
    planTier
  };
};

export const getPlanDetails = ({
  plan,
  planTier = 1
}: {
  plan: string;
  planTier?: number;
}) => {
  const planDetails = PLANS.find(
    (p) => p.name.toLowerCase() === plan.toLowerCase()
  )!;

  return enrichPlanWithTierData(planDetails, planTier);
};

export const getNextPlan = (plan?: string | null) => {
  if (!plan) return PRO_PLAN;
  const currentPlan = plan.toLowerCase().split(' ')[0]; // to account for old Business plans (e.g. "Business Plus")
  return PLANS[
    Math.min(
      // returns the next plan, or the last plan if the current plan is the last plan
      PLANS.findIndex((p) => p.name.toLowerCase() === currentPlan) + 1,
      PLANS.length - 1
    )
  ];
};

export const isDowngradePlan = ({
  currentPlan,
  newPlan,
  currentTier,
  newTier
}: {
  currentPlan: string;
  newPlan: string;
  currentTier?: number;
  newTier?: number;
}) => {
  const currentPlanIndex = PLANS.findIndex(
    (p) => p.name.toLowerCase() === currentPlan.toLowerCase()
  );
  const newPlanIndex = PLANS.findIndex(
    (p) => p.name.toLowerCase() === newPlan.toLowerCase()
  );
  return (
    currentPlanIndex > newPlanIndex ||
    (currentPlanIndex === newPlanIndex && (currentTier ?? 1) > (newTier ?? 1))
  );
};

export const isLegacyBusinessPlan = ({
  plan = 'business',
  payoutsLimit = 0
}: {
  plan?: string;
  payoutsLimit?: number;
}) => plan === 'business' && payoutsLimit === 0;
