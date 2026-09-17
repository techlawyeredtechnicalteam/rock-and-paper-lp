export type Sector = {
  name: string;
  description: string;
  image: string;
  imageAlt: string;
};

export const sectors: Sector[] = [
  {
    name: "Oil & Gas",
    description: "Licensing, regulation and gas infrastructure development.",
    image: "/images/expertise/energy.webp",
    imageAlt: "An illuminated oil and gas facility at dusk",
  },
  {
    name: "Power",
    description: "Gas-to-power projects and independent power arrangements.",
    image: "/images/sectors/power-grid.webp",
    imageAlt: "High-voltage transmission towers at sunset",
  },
  {
    name: "Infrastructure",
    description: "Project development, construction contracts and claims.",
    image: "/images/expertise/infrastructure-projects.webp",
    imageAlt: "Contemporary large-scale urban infrastructure",
  },
  {
    name: "Financial Services",
    description: "Fund structuring, project finance and investment documentation.",
    image: "/images/expertise/banking-finance.webp",
    imageAlt: "Financial professionals reviewing documents",
  },
  {
    name: "Technology",
    description: "Software, digital platforms, AI and data-driven businesses.",
    image: "/images/expertise/ip-technology.webp",
    imageAlt: "Software code displayed on a computer screen",
  },
  {
    name: "Media & Entertainment",
    description: "Content, copyright, licensing and commercial arrangements.",
    image: "/images/sectors/film-production.webp",
    imageAlt: "A film production slate ready for a scene",
  },
  {
    name: "Consumer & Retail",
    description: "Brands, distribution, commercial agreements and IP.",
    image: "/images/sectors/retail-store.webp",
    imageAlt: "A bright contemporary retail store interior",
  },
  {
    name: "Manufacturing",
    description: "Commercial transactions, regulation and intellectual property.",
    image: "/images/sectors/manufacturing.webp",
    imageAlt: "Industrial robots operating on a manufacturing line",
  },
  {
    name: "Healthcare",
    description: "Regulatory, commercial, data and contractual matters.",
    image: "/images/sectors/healthcare.webp",
    imageAlt: "A stethoscope representing healthcare services",
  },
];
