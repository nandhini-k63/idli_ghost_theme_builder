export interface PricingTier {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  period: string;
  isFeatured: boolean;
  badgeText?: string;
  buttonText: string;
  portalAction: string;
  benefits: string[];
}

export interface PricingTableProps {
  heading: string;
  subheading: string;
  showBillingToggle: boolean;
  yearlyDiscountBadge: string;
  useDynamicTiers: boolean;
  ctaNote: string;
  tiers: PricingTier[];
}

export const DEFAULT_TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    description: "Essential articles and weekly public newsletters.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: "$",
    period: "free forever",
    isFeatured: false,
    buttonText: "Join for free",
    portalAction: "signup/free",
    benefits: [
      "Access all public posts",
      "Weekly newsletter digest",
      "Public community comments",
    ],
  },
  {
    id: "supporter",
    name: "Supporter",
    description: "Full access to premium stories and subscriber community.",
    monthlyPrice: 8,
    yearlyPrice: 75,
    currency: "$",
    period: "month",
    isFeatured: true,
    badgeText: "Most Popular",
    buttonText: "Subscribe now",
    portalAction: "signup",
    benefits: [
      "Everything in Free",
      "Subscriber-only deep dives & tutorials",
      "Full access to the entire publication archive",
      "Direct author Q&A & private comments",
    ],
  },
  {
    id: "patron",
    name: "VIP Patron",
    description: "For true champions of independent journalism and research.",
    monthlyPrice: 20,
    yearlyPrice: 190,
    currency: "$",
    period: "month",
    isFeatured: false,
    badgeText: "VIP",
    buttonText: "Become a Patron",
    portalAction: "signup",
    benefits: [
      "Everything in Supporter",
      "Monthly private video roundtable",
      "Early draft previews & input on topics",
      "Patron badge on your member profile",
    ],
  },
];

export const defaultProps: PricingTableProps = {
  heading: "Simple, transparent membership",
  subheading: "Support independent writing and get full access to exclusive articles, newsletters, and community discussions.",
  showBillingToggle: true,
  yearlyDiscountBadge: "Save 20%",
  useDynamicTiers: true,
  ctaNote: "Secure payments via Stripe. Cancel or change tiers anytime in one click.",
  tiers: DEFAULT_TIERS,
};

export const defaultStyles = {
  backgroundType: "solid",
  backgroundColor: "var(--color-bg)",
};
