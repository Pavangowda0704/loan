// ============================================================
//  loanCategories.js — Plumzo Capital Services
// ============================================================

export const LOAN_CATEGORIES = [
  {
    id: 'home',
    title: 'Home Loans',
    rate: '8.5% p.a.',
    tagline: 'Make your dream home a reality',
    bullets: [
      'Quick eligibility check in 2 minutes',
      'Simple document upload — 100% online',
      'Loan up to ₹10 Crore with flexible tenure',
    ],
    subLoans: [
  { label: 'Home Loan',                 href: '/home-loan/apply',      desc: 'Buy your dream home' },
  { label: 'Loan Against Property',     href: '/home-loan',            desc: 'Unlock your property value' },
  { label: 'Mortgage Loan',             href: '/home-loan',            desc: 'Secured long-term finance' },
  { label: 'Site Purchase Loan',        href: '/home-loan',            desc: 'Buy a plot to build on' },
  { label: 'Balance Transfer & Top-Up', href: '/home-loan',            desc: 'Switch & save on interest' },
  { label: 'New House Refinance',       href: '/home-loan',            desc: 'Refinance at better rates' },
  { label: 'House Purchase Loan',       href: '/home-loan/apply',      desc: 'Ready-to-move homes' },
  { label: 'Construction Loan',         href: '/home-loan',            desc: 'Build stage by stage' },
  { label: 'Mixed Usage Property Loan', href: '/home-loan',            desc: 'Commercial + residential' },
],
    calculators: [
      { label: 'Home Loan EMI Calculator',         href: '#emi' },
      { label: 'Home Loan Eligibility Calculator', href: '#emi' },
      { label: 'Balance Transfer Calculator',      href: '#emi' },
    ],
    color: '#003087',
    bgColor: '#EEF3FF',
    iconPath: `<path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  },
  {
    id: 'business',
    title: 'Business Loans',
    rate: '10.5% p.a.',
    tagline: 'Fuel your business ambitions',
    bullets: [
      'Collateral-free loans up to ₹50 Lakh',
      'Approval in 48 hours with minimal docs',
      'Flexible repayment — 12 to 84 months',
    ],
   subLoans: [
  { label: 'Secured Business Loan',    href: '/business-loan/apply',  desc: 'Collateral-backed funding' },
  { label: 'Unsecured Business Loan',  href: '/business-loan/apply',  desc: 'No collateral needed' },
  { label: 'Working Capital Loan',     href: '/business-loan/apply',  desc: 'Keep operations running' },
  { label: 'Business Expansion Loan',  href: '/business-loan/apply',  desc: 'Scale up confidently' },
],
    calculators: [
      { label: 'Business Loan EMI Calculator',         href: '#emi' },
      { label: 'Business Loan Eligibility Calculator', href: '#emi' },
    ],
    color: '#EA580C',
    bgColor: '#FFF7ED',
    iconPath: `<rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="currentColor" stroke-width="2" fill="none"/><line x1="12" y1="12" x2="12" y2="16" stroke="currentColor" stroke-width="2"/><line x1="10" y1="14" x2="14" y2="14" stroke="currentColor" stroke-width="2"/>`,
  },
  {
    id: 'personal',
    title: 'Personal Loans',
    rate: '11.5% p.a.',
    tagline: 'Finance any personal need instantly',
    bullets: [
      'Zero collateral — fully unsecured',
      'Instant disbursal to your bank account',
      'For travel, education, medical & more',
    ],
    subLoans: [
      { label: 'Salaried Personal Loan',      href: '/personal-loan/salaried',      desc: 'For working professionals' },
      { label: 'Self-Employed Personal Loan', href: '/personal-loan/self-employed',  desc: 'For business owners' },
    ],
    calculators: [
      { label: 'Personal Loan EMI Calculator',         href: '#emi' },
      { label: 'Personal Loan Eligibility Calculator', href: '#emi' },
    ],
    color: '#9333EA',
    bgColor: '#FDF4FF',
    iconPath: `<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none"/>`,
  },
  {
    id: 'vehicle',
    title: 'Vehicle Loans',
    rate: '8.49% p.a.',
    tagline: 'Drive home your dream vehicle today',
    bullets: [
      'New & used cars, bikes and commercial',
      'Up to 100% on-road price financing',
      'Quick approval with doorstep service',
    ],
    subLoans: [
      { label: 'New Car Loan',             href: '/vehicle-loan/new-car',               desc: 'Drive home a brand new car' },
      { label: 'Used Car Loan',            href: '/vehicle-loan/used-car',              desc: 'Smart pre-owned finance' },
      { label: 'Two-Wheeler Loan',         href: '/vehicle-loan/two-wheeler',           desc: 'Bikes & scooters' },
      { label: 'Used Bike Loan',           href: '/vehicle-loan/used-bike',             desc: 'Pre-owned two-wheelers' },
      { label: 'Commercial Vehicle Loan',  href: '/vehicle-loan/commercial',            desc: 'Trucks, buses & vans' },
      { label: 'Agriculture Equipment Loan', href: '/vehicle-loan/agriculture-equipment', desc: 'Tractors & agri-machinery' },
    ],
    calculators: [
      { label: 'Vehicle Loan EMI Calculator',         href: '#emi' },
      { label: 'Vehicle Loan Eligibility Calculator', href: '/vehicle-loan/eligibility' },
    ],
    color: '#16A34A',
    bgColor: '#F0FDF4',
    iconPath: `<rect x="1" y="3" width="15" height="13" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M16 8h4l3 5v4h-7V8z" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" stroke-width="2" fill="none"/>`,
  },
]

export const NAV_LINKS = [
  { label: 'Home',           href: '#',        hasDropdown: false },
  { label: 'Loans',          href: '#loans',   hasDropdown: true  },
  { label: 'EMI Calculator', href: '#emi',     hasDropdown: false },
  { label: 'About Us',       href: '#about',   hasDropdown: false },
  { label: 'Contact Us',     href: '#contact', hasDropdown: false },
]