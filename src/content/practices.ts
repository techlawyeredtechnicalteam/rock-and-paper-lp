export type Practice = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  services: string[];
  image: string;
  imageAlt: string;
};

export const practices: Practice[] = [
  {
    slug: "energy-natural-resources",
    title: "Energy & Natural Resources",
    shortDescription: "Commercial and regulatory counsel across Nigeria's energy value chain.",
    description:
      "We advise oil and gas companies on licensing and regulatory compliance across the upstream, midstream and downstream segments of Nigeria's energy value chain, including government-backed funding processes.",
    image: "/images/expertise/energy.webp",
    imageAlt: "An illuminated industrial energy facility at dusk",
    services: [
      "Upstream, midstream and downstream licensing and regulatory compliance",
      "MDGIF and other gas infrastructure funding applications",
      "Gas-to-power transaction advisory, facility development and offtake arrangements",
      "Company secretarial services to gas and power investment vehicles",
    ],
  },
  {
    slug: "banking-finance",
    title: "Banking & Finance",
    shortDescription: "Practical financing counsel for lenders, investors and project sponsors.",
    description:
      "We advise on the financing of energy and infrastructure transactions as well as standalone banking and finance matters, working closely with lenders, investors and project sponsors.",
    image: "/images/expertise/banking-finance.webp",
    imageAlt: "Financial professionals reviewing documents at a desk",
    services: [
      "Project and structured financing documentation",
      "Loan, guarantee and security agreements",
      "Regulatory compliance for financial institutions and investment vehicles",
      "Fund structuring, drawdown and disbursement documentation",
    ],
  },
  {
    slug: "dispute-resolution",
    title: "Dispute Resolution",
    shortDescription: "Litigation, arbitration and negotiated resolution of complex disputes.",
    description:
      "Our dispute resolution work spans litigation and arbitration, with particular depth in commercial, energy, intellectual property and finance-related disputes.",
    image: "/images/expertise/dispute-resolution.webp",
    imageAlt: "Professionals in a focused meeting and discussion",
    services: [
      "Commercial litigation, arbitration and mediation",
      "Representation before regulatory and administrative tribunals",
      "Enforcement of judgments and arbitral awards",
      "Dispute avoidance and settlement negotiation",
    ],
  },
  {
    slug: "intellectual-property-technology",
    title: "Intellectual Property & Technology",
    shortDescription: "Protection and commercialisation of brands, technology and creative assets.",
    description:
      "We advise businesses and individuals on protecting, managing and commercialising intellectual property and technology assets, from registration and portfolio management to transactions and enforcement.",
    image: "/images/expertise/ip-technology.webp",
    imageAlt: "Software code displayed on a computer screen",
    services: [
      "Trademark and copyright registration, prosecution and portfolio management",
      "IP licensing, assignments, commercialisation and technology transactions",
      "Brand protection, oppositions, cancellation, invalidation and enforcement",
      "Data protection, privacy, technology and artificial intelligence advisory",
    ],
  },
  {
    slug: "corporate-commercial",
    title: "Corporate & Commercial",
    shortDescription: "Business-focused counsel through formation, growth and transformation.",
    description:
      "We provide company secretarial and corporate advisory services to investment vehicles, joint ventures and operating companies, with particular experience in the energy and infrastructure space.",
    image: "/images/expertise/corporate-commercial.webp",
    imageAlt: "Geometric glass facades of modern corporate towers",
    services: [
      "Company secretarial services and statutory compliance",
      "Board governance and corporate structuring and restructuring",
      "Group reorganisations and joint venture documentation",
      "Shareholder and investment agreements",
    ],
  },
  {
    slug: "infrastructure-projects",
    title: "Infrastructure & Projects",
    shortDescription: "Regulatory and transactional support for complex infrastructure projects.",
    description:
      "We advise on regulatory and structuring questions arising around large infrastructure projects, particularly in the gas and power sectors, from land use and permitting through to project-level agreements.",
    image: "/images/expertise/infrastructure-projects.webp",
    imageAlt: "A contemporary glass infrastructure building against the sky",
    services: [
      "Regulatory filings and compliance for gas and power projects",
      "Land use, site acquisition and permitting",
      "Project development and offtake agreements",
      "Engagement with regulatory bodies, including NMDPRA and NERC",
    ],
  },
  {
    slug: "regulatory-compliance",
    title: "Regulatory & Compliance",
    shortDescription: "Clear guidance through sector regulation and government engagement.",
    description:
      "We help businesses understand and meet the regulatory requirements applicable to their operations while managing regulatory risks and engagements with relevant authorities.",
    image: "/images/expertise/regulatory-compliance.webp",
    imageAlt: "Layered architectural lines suggesting order and structure",
    services: [
      "Regulatory filings, approvals and ongoing compliance",
      "Regulatory investigations and enforcement proceedings",
      "Corporate, industry-specific and statutory compliance advisory",
      "Regulatory risk assessment and authority engagement",
    ],
  },
  {
    slug: "employment-labour",
    title: "Employment & Labour",
    shortDescription: "Advice across the employment relationship, from hiring to disputes.",
    description:
      "We advise employers and employees on legal issues arising throughout the employment relationship, from hiring and workplace management to termination and disputes.",
    image: "/images/expertise/employment-labour.webp",
    imageAlt: "A collaborative team working together around a table",
    services: [
      "Employment contracts, policies and workplace advisory",
      "Employee relations, disciplinary and termination matters",
      "Labour and employment regulatory compliance",
      "Employment disputes, negotiations and litigation",
    ],
  },
  {
    slug: "telecommunications",
    title: "Telecommunications",
    shortDescription: "Regulatory and commercial counsel across the communications ecosystem.",
    description:
      "We advise operators, service providers, infrastructure companies and investors on the licensing, regulatory and commercial arrangements governing telecommunications activity in Nigeria.",
    image: "/images/expertise/telecommunications.webp",
    imageAlt: "Detailed telecommunications and computer circuit board",
    services: [
      "NCC licensing, renewals, type approval and regulatory compliance",
      "Spectrum, infrastructure sharing, colocation and right-of-way arrangements",
      "Interconnection, roaming, capacity and network deployment agreements",
      "Consumer protection, quality of service and subscriber data protection",
    ],
  },
];

export const getPractice = (slug: string) =>
  practices.find((practice) => practice.slug === slug);
